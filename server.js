/**
 * AirPost — Host half.
 *
 * One plugin-owned HTTP route and one Agent tool call the same operation layer:
 *   - definitions, flows, variables, runs, and reports live under
 *     `<session-cwd>/.api-studio/`
 *   - requests are executed with the Host's `fetch`
 *   - business flows chain requests and extract variables between steps
 *   - AI authoring and analysis use the profile's default model through `ctx.llm`
 *
 * The route is same-origin and admitted through `ctx.connection`, exactly like
 * the shipped `/api` surface.
 */
import { AsyncLocalStorage } from 'node:async_hooks'
import { createHash, createHmac, randomUUID } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, join, resolve, sep } from 'node:path'
import vm from 'node:vm'
import { parse as parseYaml } from 'yaml'

const ROUTE = '/api-studio'
const STORE_NAME = '.api-studio'
const MAX_BODY_BYTES = 4 * 1024 * 1024
const MAX_RESPONSE_BYTES = 2 * 1024 * 1024
const MAX_STORED_BODY_BYTES = 600 * 1024
const MAX_RUNS = 80
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const MAX_REPORTS = 120
const DEFAULT_TIMEOUT_MS = 30_000
const AI_TIMEOUT_MS = 120_000
const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,80}$/
const METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'])

/** @type {Map<string, Promise<Store>>} */
const stores = new Map()
/** Carries the exact Session through one operation's async call tree. */
const operationContext = new AsyncLocalStorage()

class StudioError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.name = 'StudioError'
    this.status = status
  }
}

/** Host plugin entry point. */
export const inject = ['webServer', 'connection', 'tools']

export function apply(ctx) {
  ctx.effect(
    () =>
      ctx.webServer.register({
        kind: 'exact',
        path: ROUTE,
        handler: (req, res) => handleRoute(ctx, req, res),
      }),
    'api-studio: host route',
  )

  ctx.effect(
    () => ctx.webServer.register({
      kind: 'prefix',
      path: ROUTE + '/mock',
      handler: (req, res) => handleMock(ctx, req, res),
    }),
    'api-studio: mock route',
  )

  ctx.effect(
    () => ctx.tools.register(createTool(ctx)),
    'api-studio: agent tool',
  )

  ctx.logger.info('api-studio: ready at ' + ROUTE)
}

/* ------------------------------------------------------------------ */
/* HTTP route                                                          */
/* ------------------------------------------------------------------ */

async function handleRoute(ctx, req, res) {
  const rejection = ctx.connection.requestRejection(req)
  if (rejection !== undefined) {
    res.writeHead(rejection)
    res.end(rejection === 401 ? 'unauthorized' : 'forbidden')
    return
  }
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, message: 'method not allowed' })
    return
  }
  if (mediaType(req.headers['content-type']) !== 'application/json') {
    sendJson(res, 415, { ok: false, message: 'content-type must be application/json' })
    return
  }

  let body
  try {
    body = await readJsonBody(req)
  } catch (error) {
    sendJson(res, 400, { ok: false, message: messageOf(error) })
    return
  }
  if (!isPlainObject(body)) {
    sendJson(res, 400, { ok: false, message: 'body must be a JSON object' })
    return
  }
  const action = typeof body.action === 'string' ? body.action : ''
  if (action.length === 0) {
    sendJson(res, 400, { ok: false, message: 'action is required' })
    return
  }

  try {
    const data = await callStudio(ctx, action, body)
    sendJson(res, 200, { ok: true, data })
  } catch (error) {
    const status = error instanceof StudioError ? error.status : 500
    if (status >= 500) ctx.logger.warn(`api-studio: ${action}: ${messageOf(error)}`)
    sendJson(res, status, { ok: false, message: messageOf(error) })
  }
}

/* ------------------------------------------------------------------ */
/* Mock server                                                         */
/* ------------------------------------------------------------------ */

async function handleMock(ctx, req, res) {
  const cors = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS',
    'access-control-allow-headers': '*',
    'access-control-expose-headers': '*',
    'cache-control': 'no-store',
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors)
    res.end()
    return
  }
  let url
  try {
    url = new URL(req.url, 'http://127.0.0.1')
  } catch {
    for (const [key, value] of Object.entries(cors)) res.setHeader(key, value)
    sendJson(res, 400, { ok: false, message: 'invalid mock URL' })
    return
  }
  const id = decodeURIComponent(url.pathname.slice((ROUTE + '/mock/').length))
  if (!ID_PATTERN.test(id)) {
    for (const [key, value] of Object.entries(cors)) res.setHeader(key, value)
    sendJson(res, 404, { ok: false, message: 'mock request id is required' })
    return
  }
  const sessionId = url.searchParams.get('sessionId') || ''
  try {
    const scoped = (operation) => sessionId.length > 0 && ID_PATTERN.test(sessionId)
      ? operationContext.run({ sessionId }, operation)
      : operation()
    let request
    let pathParams = {}
    if (id === 'path') {
      const target = String(url.searchParams.get('path') ?? '')
      if (target.length === 0) throw new StudioError('path mock requires ?path=', 400)
      const method = String(url.searchParams.get('method') ?? req.method ?? '').toUpperCase()
      const requests = await scoped(() => listRequests(ctx))
      for (const entry of requests) {
        if (entry.mock?.enabled !== true || entry.mock.path.length === 0 || entry.method !== method) continue
        if (!mockConditionsMatch(entry.mock.conditions, target, req.headers)) continue
        const match = matchMockPath(entry.mock.path, target)
        if (match) {
          request = entry
          pathParams = match
          break
        }
      }
      if (request === undefined) throw new StudioError('no path mock matched', 404)
    } else {
      request = await scoped(() => readRequest(ctx, id))
    }
    if (request === undefined) throw new StudioError('mock target not found', 404)
    const mock = request.mock
    if (!mock || mock.enabled !== true) throw new StudioError('mock is disabled for this request', 404)
    if (mock.delayMs > 0) await delay(mock.delayMs)
    const example = Array.isArray(request.examples)
      ? request.examples.find((entry) => entry.id === mock.exampleId) ?? request.examples[0]
      : undefined
    const customBody = String(mock.body ?? '')
    const template = customBody.trim().length === 0
      ? (example?.body ?? (request.body?.type === 'json' ? request.body.text : ''))
      : ''
    let body = customBody
    let useExample = false
    if (customBody.trim().length === 0 && mock.smart === true && isPlainObject(mock.schema)) {
      body = JSON.stringify(smartMockFromSchema(mock.schema), null, 2)
    } else if (customBody.trim().length === 0 && mock.smart === true && template.trim().length > 0) {
      body = smartMockJson(template)
      useExample = example !== undefined
    } else if (customBody.trim().length === 0 && example !== undefined) {
      body = example.body
      useExample = true
    }
    const mockStatus = useExample ? example.status : mock.status
    const mockHeaders = useExample ? example.headers : mock.headers
    const mockVars = { ...pathParams, ...Object.fromEntries(url.searchParams.entries()) }
    const renderMock = (value) => renderValue(String(value ?? ''), mockVars, [])
    const headers = { ...cors }
    for (const entry of mockHeaders ?? []) {
      if (entry.enabled === false || entry.key.trim().length === 0) continue
      headers[entry.key.toLowerCase()] = renderMock(entry.value)
    }
    body = renderMock(body)
    if (headers['content-type'] === undefined) headers['content-type'] = looksLikeJson(body) ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8'
    headers['content-length'] = String(Buffer.byteLength(body))
    headers['x-airpost-mock'] = '1'
    res.writeHead(mockStatus || 200, headers)
    res.end(req.method === 'HEAD' ? '' : body)
  } catch (error) {
    const status = error instanceof StudioError ? error.status : 500
    for (const [key, value] of Object.entries(cors)) res.setHeader(key, value)
    sendJson(res, status, { ok: false, message: messageOf(error) })
  }
}

/* ------------------------------------------------------------------ */
/* Shared operation layer                                              */
/* ------------------------------------------------------------------ */

function callStudio(ctx, action, params) {
  const sessionId = resolveSessionId(ctx, params)
  return operationContext.run({ sessionId }, () => dispatchStudio(ctx, action, params))
}

/** Resolve the Session that owns this operation, rejecting a stale explicit id. */
function resolveSessionId(ctx, params) {
  const requested = params && typeof params.sessionId === 'string' ? params.sessionId : ''
  if (requested.length > 0) {
    if (!ID_PATTERN.test(requested)) throw new StudioError('sessionId 无效', 400)
    const session = ctx.get('sessions')?.get?.(requested)
    const agent = ctx.get('agents')?.get?.(requested)
    if (session === undefined && agent === undefined) throw new StudioError(`会话 "${requested}" 不存在或未加载`, 404)
    return requested
  }
  const initiator = ctx.get('agents')?.currentInitiator?.()
  if (initiator !== undefined && typeof initiator.id === 'string') return initiator.id
  return undefined
}

async function dispatchStudio(ctx, action, params) {
  switch (action) {
    case 'bootstrap':
      return bootstrap(ctx)
    case 'save_request':
      return saveRequestFromInput(ctx, params.request)
    case 'list_history':
      return listRequestHistory(ctx, requireId(params.requestId, 'requestId'))
    case 'restore_history':
      return restoreRequestHistory(ctx, requireId(params.requestId, 'requestId'), String(params.revisionId ?? ''))
    case 'save_flow':
      return saveFlowFromInput(ctx, params.flow)
    case 'delete_request':
      return deleteRequest(ctx, requireId(params.requestId, 'requestId'), params.force === true)
    case 'delete_flow':
      return deleteFlow(ctx, requireId(params.flowId, 'flowId'))
    case 'get_request':
      return getRequest(ctx, requireId(params.requestId, 'requestId'))
    case 'get_flow':
      return getFlow(ctx, requireId(params.flowId, 'flowId'))
    case 'run_request':
      return runRequestAction(ctx, params)
    case 'run_case':
      return runCaseAction(ctx, params)
    case 'run_flow':
      return runFlowAction(ctx, params)
    case 'run_flow_dataset':
      return runFlowDatasetAction(ctx, params)
    case 'list_runs':
      return listRuns(ctx)
    case 'get_run':
      return getRun(ctx, requireId(params.runId, 'runId'))
    case 'save_variables':
      return saveVariables(ctx, params.variables)
    case 'save_environments':
      return saveEnvironments(ctx, params)
    case 'import_data':
      return importData(ctx, params)
    case 'export_data':
      return exportData(ctx, params)
    case 'run_all':
      return runAll(ctx, params)
    case 'list_reports':
      return listReports(ctx)
    case 'read_report':
      return readReport(ctx, requireId(params.reportId, 'reportId'))
    case 'delete_report':
      return deleteReport(ctx, requireId(params.reportId, 'reportId'))
    case 'ai_create':
      return aiCreate(ctx, params)
    case 'ai_analyze':
      return aiAnalyze(ctx, params)
    case 'self_test':
      return selfTest()
    default:
      throw new StudioError(`unknown action "${action}"`, 400)
  }
}

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

/** @typedef {ReturnType<typeof storePaths>} Store */

function storePaths(base) {
  const root = join(base, STORE_NAME)
  return {
    base,
    root,
    requests: join(root, 'requests'),
    flows: join(root, 'flows'),
    runs: join(root, 'runs'),
    reports: join(root, 'reports'),
    history: join(root, 'history'),
    workspace: join(root, 'workspace.json'),
    runIndex: join(root, 'runs', 'index.json'),
    reportIndex: join(root, 'reports', 'index.json'),
  }
}

function workspaceBase(ctx) {
  const configured = process.env.API_STUDIO_ROOT
  if (typeof configured === 'string' && configured.trim().length > 0) return resolve(configured.trim())

  const sessionId = operationContext.getStore()?.sessionId
  if (typeof sessionId === 'string' && sessionId.length > 0) {
    const session = ctx.get('sessions')?.get?.(sessionId)
    if (session !== undefined) {
      try {
        const current = ctx.get('workingDirectory')?.get?.(session)
        if (typeof current === 'string' && current.length > 0 && existsSync(current)) return resolve(current)
      } catch {
        // Fall through to the Session's original project directory.
      }
      const original = session?.header?.cwd
      if (typeof original === 'string' && original.length > 0 && existsSync(original)) return resolve(original)
      throw new StudioError(`会话 "${sessionId}" 的工作目录不可用`, 409)
    }
  }

  // Fallback for an agentless/legacy call: the most recent live Session's cwd.
  // This path is intentionally not cached, so it cannot pin a later Session.
  try {
    const sessions = ctx.get('sessions')?.list?.() ?? []
    const candidates = sessions
      .map((session) => ({
        cwd: session?.header?.cwd,
        createdAt: Number(session?.header?.createdAt) || 0,
      }))
      .filter((entry) => typeof entry.cwd === 'string' && entry.cwd.length > 0)
      .sort((left, right) => right.createdAt - left.createdAt)
    if (candidates.length > 0) return resolve(candidates[0].cwd)
  } catch {
    // Fall through to the process directory when Session state is unavailable.
  }
  return process.cwd()
}

async function ensureStore(ctx) {
  const base = workspaceBase(ctx)
  const paths = storePaths(base)
  let pending = stores.get(paths.root)
  if (pending === undefined) {
    pending = initializeStore(paths).catch((error) => {
      stores.delete(paths.root)
      throw error
    })
    stores.set(paths.root, pending)
  }
  return pending
}

async function initializeStore(paths) {
  await mkdir(paths.requests, { recursive: true })
  await mkdir(paths.flows, { recursive: true })
  await mkdir(paths.runs, { recursive: true })
  await mkdir(paths.reports, { recursive: true })
  await mkdir(paths.history, { recursive: true })
  if (!(await exists(paths.workspace))) {
    await writeJsonAtomic(paths.workspace, defaultWorkspace())
  }
  if (!(await exists(paths.runIndex))) await writeJsonAtomic(paths.runIndex, [])
  if (!(await exists(paths.reportIndex))) await writeJsonAtomic(paths.reportIndex, [])
  return paths
}

function defaultWorkspace() {
  const baseUrl = 'https://jsonplaceholder.typicode.com'
  return {
    version: 2,
    variables: { baseUrl },
    environments: [
      {
        id: 'env-default',
        name: 'Default',
        variables: { baseUrl },
      },
    ],
    activeEnvironmentId: 'env-default',
    globalHeaders: [],
    globalQuery: [],
    updatedAt: nowIso(),
  }
}

async function bootstrap(ctx) {
  const store = await ensureStore(ctx)
  const [requests, flows, workspace, runs, reports] = await Promise.all([
    listRequests(ctx),
    listFlows(ctx),
    readWorkspace(store),
    listRuns(ctx),
    listReports(ctx),
  ])
  const origin = safeOrigin(ctx)
  return {
    root: store.base,
    store: store.root,
    origin,
    mockBase: origin ? `${origin}${ROUTE}/mock` : '',
    workspace: workspace.variables,
    environments: workspace.environments,
    activeEnvironmentId: workspace.activeEnvironmentId,
    globalHeaders: workspace.globalHeaders,
    globalQuery: workspace.globalQuery,
    requests,
    flows,
    runs,
    reports,
    counts: {
      requests: requests.length,
      flows: flows.length,
      runs: runs.length,
      reports: reports.length,
    },
    ai: aiStatus(ctx),
    limits: {
      maxResponseBytes: MAX_RESPONSE_BYTES,
      maxRuns: MAX_RUNS,
      defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
    },
  }
}

function safeOrigin(ctx) {
  try {
    const origin = ctx.get('webServer')?.getOrigin?.()
    return typeof origin === 'string' && origin.length > 0 ? origin : ''
  } catch {
    return ''
  }
}

/* ------------------------------------------------------------------ */
/* Request definitions                                                 */
/* ------------------------------------------------------------------ */

async function listRequests(ctx) {
  const store = await ensureStore(ctx)
  const files = await listJsonFiles(store.requests)
  const requests = []
  for (const file of files) {
    const value = await readJson(file, undefined)
    if (!isPlainObject(value) || typeof value.id !== 'string') continue
    requests.push(normalizeRequest(value, undefined, value.id))
  }
  return requests.sort((left, right) => left.name.localeCompare(right.name, 'zh-Hans-CN'))
}

async function getRequest(ctx, id) {
  const store = await ensureStore(ctx)
  const value = await readJson(requestFile(store, id), undefined)
  if (!isPlainObject(value)) throw new StudioError(`接口 "${id}" 不存在`, 404)
  return normalizeRequest(value, undefined, id)
}

async function readRequest(ctx, id) {
  const store = await ensureStore(ctx)
  const value = await readJson(requestFile(store, id), undefined)
  if (!isPlainObject(value)) return undefined
  return normalizeRequest(value, undefined, id)
}

async function saveRequestFromInput(ctx, input) {
  if (typeof input === 'string') input = parseJsonInput(input, 'request')
  if (!isPlainObject(input)) throw new StudioError('request 必须是 JSON 对象', 400)
  const store = await ensureStore(ctx)
  const requestedId = typeof input.id === 'string' && ID_PATTERN.test(input.id) ? input.id : ''
  const existing = requestedId.length > 0 ? await readJson(requestFile(store, requestedId), undefined) : undefined
  const normalized = normalizeRequest(input, isPlainObject(existing) ? existing : undefined, requestedId || newId('req'))
  if (normalized.name.length === 0) throw new StudioError('接口名称不能为空', 400)
  if (normalized.url.length === 0) throw new StudioError('接口 URL 不能为空', 400)
  if (isPlainObject(existing)) await archiveRequestHistory(store, normalized.id, existing)
  const timestamp = nowIso()
  normalized.createdAt = isPlainObject(existing) && typeof existing.createdAt === 'string' ? existing.createdAt : timestamp
  normalized.updatedAt = timestamp
  await writeJsonAtomic(requestFile(store, normalized.id), normalized)
  return normalized
}

async function deleteRequest(ctx, id, force) {
  const store = await ensureStore(ctx)
  const file = requestFile(store, id)
  if (!(await exists(file))) throw new StudioError(`接口 "${id}" 不存在`, 404)
  const flows = await listFlows(ctx)
  const usedBy = flows.filter((flow) => flow.steps.some((step) => step.requestId === id)).map((flow) => ({ id: flow.id, name: flow.name }))
  if (usedBy.length > 0 && !force) {
    throw new StudioError(`接口仍被 ${usedBy.length} 个流程引用：${usedBy.map((flow) => flow.name).join('、')}`, 409)
  }
  await rm(file, { force: true })
  await rm(join(store.history, id), { recursive: true, force: true }).catch(() => {})
  return { deleted: true, id, usedBy }
}

function requestFile(store, id) {
  return safeFile(store.requests, id, 'json')
}
const MAX_REQUEST_HISTORY = 20

async function archiveRequestHistory(store, id, value) {
  try {
    const directory = join(store.history, id)
    await mkdir(directory, { recursive: true })
    const revisionId = `${Date.now()}-${randomUUID().slice(0, 6)}`
    await writeJsonAtomic(join(directory, `${revisionId}.json`), value)
    const files = (await readdir(directory)).filter((file) => file.endsWith('.json')).sort()
    while (files.length > MAX_REQUEST_HISTORY) {
      const oldest = files.shift()
      await rm(join(directory, oldest), { force: true }).catch(() => {})
    }
  } catch {
    // History is best effort; a failed archive must not block saving the request.
  }
}

async function listRequestHistory(ctx, requestId) {
  const store = await ensureStore(ctx)
  const directory = join(store.history, requestId)
  if (!(await exists(directory))) return { items: [] }
  const files = (await readdir(directory)).filter((file) => file.endsWith('.json')).sort().reverse()
  const items = []
  for (const file of files) {
    const value = await readJson(join(directory, file), undefined)
    if (!isPlainObject(value)) continue
    items.push({
      revisionId: file.slice(0, -5),
      name: String(value.name ?? ''),
      method: String(value.method ?? 'GET'),
      url: String(value.url ?? ''),
      updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : '',
    })
  }
  return { items }
}

async function restoreRequestHistory(ctx, requestId, revisionId) {
  const store = await ensureStore(ctx)
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,80}$/.test(revisionId)) throw new StudioError('revisionId 无效', 400)
  const file = safeFile(join(store.history, requestId), revisionId, 'json')
  const value = await readJson(file, undefined)
  if (!isPlainObject(value)) throw new StudioError('历史版本不存在', 404)
  return saveRequestFromInput(ctx, { ...value, id: requestId })
}


/* ------------------------------------------------------------------ */
/* Flows                                                               */
/* ------------------------------------------------------------------ */

async function listFlows(ctx) {
  const store = await ensureStore(ctx)
  const files = await listJsonFiles(store.flows)
  const flows = []
  for (const file of files) {
    const value = await readJson(file, undefined)
    if (!isPlainObject(value) || typeof value.id !== 'string') continue
    flows.push(normalizeFlow(value, undefined, value.id))
  }
  return flows.sort((left, right) => left.name.localeCompare(right.name, 'zh-Hans-CN'))
}

async function getFlow(ctx, id) {
  const store = await ensureStore(ctx)
  const value = await readJson(flowFile(store, id), undefined)
  if (!isPlainObject(value)) throw new StudioError(`流程 "${id}" 不存在`, 404)
  return normalizeFlow(value, undefined, id)
}

async function readFlow(ctx, id) {
  const store = await ensureStore(ctx)
  const value = await readJson(flowFile(store, id), undefined)
  if (!isPlainObject(value)) return undefined
  return normalizeFlow(value, undefined, id)
}

async function saveFlowFromInput(ctx, input) {
  if (typeof input === 'string') input = parseJsonInput(input, 'flow')
  if (!isPlainObject(input)) throw new StudioError('flow 必须是 JSON 对象', 400)
  const store = await ensureStore(ctx)
  const requestedId = typeof input.id === 'string' && ID_PATTERN.test(input.id) ? input.id : ''
  const existing = requestedId.length > 0 ? await readJson(flowFile(store, requestedId), undefined) : undefined
  const normalized = normalizeFlow(input, isPlainObject(existing) ? existing : undefined, requestedId || newId('flow'))
  if (normalized.name.length === 0) throw new StudioError('流程名称不能为空', 400)
  if (normalized.steps.length === 0) throw new StudioError('流程至少需要一个步骤', 400)
  const requests = await listRequests(ctx)
  const byId = new Map(requests.map((request) => [request.id, request]))
  for (const step of normalized.steps) {
    if (!byId.has(step.requestId)) {
      throw new StudioError(`步骤 "${step.name}" 引用的接口 "${step.requestId}" 不存在`, 400)
    }
  }
  const timestamp = nowIso()
  normalized.createdAt = isPlainObject(existing) && typeof existing.createdAt === 'string' ? existing.createdAt : timestamp
  normalized.updatedAt = timestamp
  normalized.steps = normalized.steps.map((step) => ({
    ...step,
    requestId: byId.get(step.requestId).id,
  }))
  await writeJsonAtomic(flowFile(store, normalized.id), normalized)
  return normalized
}

async function deleteFlow(ctx, id) {
  const store = await ensureStore(ctx)
  const file = flowFile(store, id)
  if (!(await exists(file))) throw new StudioError(`流程 "${id}" 不存在`, 404)
  await rm(file, { force: true })
  return { deleted: true, id }
}

function flowFile(store, id) {
  return safeFile(store.flows, id, 'json')
}

/* ------------------------------------------------------------------ */
/* Workspace variables                                                 */
/* ------------------------------------------------------------------ */

async function readWorkspace(store) {
  const value = await readJson(store.workspace, undefined)
  if (!isPlainObject(value)) return defaultWorkspace()
  const fallback = defaultWorkspace()
  const environments = normalizeEnvironments(value.environments, value.variables)
  const activeEnvironmentId = environments.some((entry) => entry.id === value.activeEnvironmentId)
    ? value.activeEnvironmentId
    : environments[0].id
  return {
    version: 2,
    variables: isPlainObject(value.variables) ? normalizeVariables(value.variables) : fallback.variables,
    environments,
    activeEnvironmentId,
    globalHeaders: asEntries(value.globalHeaders),
    globalQuery: asEntries(value.globalQuery),
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : nowIso(),
  }
}

function normalizeEnvironments(value, fallbackVariables) {
  const fallback = defaultWorkspace().environments
  const list = Array.isArray(value) ? value : fallback
  const seen = new Set()
  const normalized = []
  for (const entry of list) {
    if (!isPlainObject(entry)) continue
    const id = typeof entry.id === 'string' && ID_PATTERN.test(entry.id) ? entry.id : newId('env')
    if (seen.has(id)) continue
    seen.add(id)
    normalized.push({
      id,
      name: String(entry.name ?? 'Environment').trim() || 'Environment',
      variables: isPlainObject(entry.variables)
        ? normalizeVariables(entry.variables)
        : isPlainObject(fallbackVariables)
          ? normalizeVariables(fallbackVariables)
          : {},
    })
  }
  if (normalized.length === 0) {
    normalized.push({ id: 'env-default', name: 'Default', variables: normalizeVariables(fallbackVariables) })
  }
  return normalized
}

async function writeWorkspace(store, workspace) {
  const value = {
    version: 2,
    variables: normalizeVariables(workspace.variables),
    environments: normalizeEnvironments(workspace.environments, workspace.variables),
    activeEnvironmentId: workspace.activeEnvironmentId,
    globalHeaders: asEntries(workspace.globalHeaders),
    globalQuery: asEntries(workspace.globalQuery),
    updatedAt: nowIso(),
  }
  if (!value.environments.some((entry) => entry.id === value.activeEnvironmentId)) {
    value.activeEnvironmentId = value.environments[0].id
  }
  await writeJsonAtomic(store.workspace, value)
  return value
}

async function saveVariables(ctx, variables) {
  if (!isPlainObject(variables)) throw new StudioError('variables 必须是 JSON 对象', 400)
  const store = await ensureStore(ctx)
  const current = await readWorkspace(store)
  const next = { ...current.variables }
  for (const [rawKey, rawValue] of Object.entries(variables)) {
    const key = rawKey.trim()
    if (key.length === 0) continue
    if (rawValue === null) {
      delete next[key]
      continue
    }
    if (!['string', 'number', 'boolean'].includes(typeof rawValue)) {
      throw new StudioError(`变量 "${key}" 只能是字符串、数字或布尔值`, 400)
    }
    next[key] = String(rawValue)
  }
  const saved = await writeWorkspace(store, { ...current, variables: next })
  return { variables: saved.variables, environments: saved.environments, activeEnvironmentId: saved.activeEnvironmentId }
}

async function saveEnvironments(ctx, params) {
  const store = await ensureStore(ctx)
  const current = await readWorkspace(store)
  const environments = normalizeEnvironments(params.environments, current.variables)
  const activeEnvironmentId = environments.some((entry) => entry.id === params.activeEnvironmentId)
    ? params.activeEnvironmentId
    : environments[0].id
  const variables = isPlainObject(params.variables) ? normalizeVariables(params.variables) : current.variables
  const saved = await writeWorkspace(store, {
    ...current,
    variables,
    environments,
    activeEnvironmentId,
    globalHeaders: params.globalHeaders !== undefined ? asEntries(params.globalHeaders) : current.globalHeaders,
    globalQuery: params.globalQuery !== undefined ? asEntries(params.globalQuery) : current.globalQuery,
  })
  return {
    variables: saved.variables,
    environments: saved.environments,
    activeEnvironmentId: saved.activeEnvironmentId,
    globalHeaders: saved.globalHeaders,
    globalQuery: saved.globalQuery,
  }
}

/* ------------------------------------------------------------------ */
/* Import / export                                                     */
/* ------------------------------------------------------------------ */

function shellTokens(text) {
  const tokens = []
  let current = ''
  let quote = ''
  let escaped = false
  for (const char of String(text ?? '')) {
    if (escaped) { current += char; escaped = false; continue }
    if (char === '\\' && quote !== "'") { escaped = true; continue }
    if (quote.length > 0) {
      if (char === quote) quote = ''
      else current += char
      continue
    }
    if (char === '"' || char === "'") { quote = char; continue }
    if (/\s/.test(char)) {
      if (current.length > 0) { tokens.push(current); current = '' }
      continue
    }
    current += char
  }
  if (current.length > 0) tokens.push(current)
  return tokens
}

function splitUrlQuery(url) {
  const raw = String(url ?? '')
  const index = raw.indexOf('?')
  if (index < 0) return { url: raw, query: [] }
  const query = []
  for (const [key, value] of new URLSearchParams(raw.slice(index + 1)).entries()) query.push({ key, value, enabled: true })
  return { url: raw.slice(0, index), query }
}

function headerEntriesFromHeaders(headers) {
  if (!headers || typeof headers !== 'object') return []
  if (Array.isArray(headers)) return headers.filter(isPlainObject).map((entry) => ({ key: String(entry.key ?? entry.name ?? ''), value: String(entry.value ?? ''), enabled: entry.disabled !== true && entry.enabled !== false })).filter((entry) => entry.key.length > 0)
  return Object.entries(headers).map(([key, value]) => ({ key, value: String(value ?? ''), enabled: true }))
}

function bodyFromContentType(contentType, text, fields) {
  const type = String(contentType ?? '').toLowerCase()
  if (type.includes('json')) return { type: 'json', text: String(text ?? ''), fields: [] }
  if (Array.isArray(fields) && fields.some((entry) => entry.type === 'file')) return { type: 'multipart', text: '', fields }
  if (type.includes('x-www-form-urlencoded') || (Array.isArray(fields) && fields.length > 0)) return { type: 'form', text: String(text ?? ''), fields: fields ?? [] }
  return { type: 'text', text: String(text ?? ''), fields: [] }
}

function parseInsomniaDocument(text) {
  let document
  try { document = JSON.parse(text) } catch { throw new StudioError('Insomnia JSON 解析失败', 400) }
  const resources = Array.isArray(document.resources) ? document.resources : Array.isArray(document) ? document : []
  const groups = new Map(resources.filter((entry) => entry?._type === 'request_group').map((entry) => [entry._id, entry.name]))
  const folderOf = (entry) => {
    const names = []
    let parent = entry.parentId
    while (parent && groups.has(parent)) { names.unshift(groups.get(parent)); parent = resources.find((item) => item?._id === parent)?.parentId }
    return names.join('/')
  }
  return resources.filter((entry) => entry?._type === 'request').map((entry) => {
    const split = splitUrlQuery(entry.url ?? '')
    const headers = (entry.headers ?? []).filter(isPlainObject).map((header) => ({ key: String(header.name ?? ''), value: String(header.value ?? ''), enabled: header.disabled !== true }))
    let body = { type: 'none', text: '', fields: [] }
    const mimeType = String(entry.body?.mimeType ?? '')
    if (mimeType.includes('json')) body = { type: 'json', text: String(entry.body?.text ?? ''), fields: [] }
    else if (mimeType.includes('x-www-form-urlencoded') && Array.isArray(entry.body?.params)) {
      const fields = entry.body.params.filter(isPlainObject).map((item) => ({ key: String(item.name ?? ''), value: String(item.value ?? ''), enabled: item.disabled !== true, type: 'text' }))
      body = { type: 'form', text: new URLSearchParams(fields.map((item) => [item.key, item.value])).toString(), fields }
    } else if (mimeType.includes('multipart') && Array.isArray(entry.body?.params)) {
      const fields = entry.body.params.filter(isPlainObject).map((item) => item.type === 'file' ? { key: String(item.name ?? ''), value: '', enabled: item.disabled !== true, type: 'file', filename: String(item.fileName ?? item.value ?? ''), contentType: '', data: '' } : { key: String(item.name ?? ''), value: String(item.value ?? ''), enabled: item.disabled !== true, type: 'text' })
      body = { type: 'multipart', text: '', fields }
    } else if (typeof entry.body?.text === 'string' && entry.body.text.length > 0) body = { type: 'text', text: entry.body.text, fields: [] }
    const auth = { type: 'none' }
    const authentication = entry.authentication ?? {}
    if (authentication.type === 'bearer') { auth.type = 'bearer'; auth.token = String(authentication.token ?? '') }
    if (authentication.type === 'basic') { auth.type = 'basic'; auth.username = String(authentication.username ?? ''); auth.password = String(authentication.password ?? '') }
    return {
      name: String(entry.name ?? 'Insomnia request'),
      description: String(entry.description ?? ''),
      folder: folderOf(entry),
      method: String(entry.method ?? 'GET').toUpperCase(),
      url: split.url,
      headers,
      query: split.query,
      body,
      auth,
      tests: [],
    }
  })
}

function parseYApiDocument(text) {
  let document
  try { document = JSON.parse(text) } catch { throw new StudioError('YApi JSON 解析失败', 400) }
  const entries = Array.isArray(document) ? document : Array.isArray(document.data) ? document.data : Array.isArray(document.list) ? document.list : []
  return entries.filter(isPlainObject).map((entry) => {
    const path = String(entry.path ?? entry.url ?? '')
    const url = /^https?:\/\//i.test(path) ? path : `{{baseUrl}}${path.startsWith('/') ? '' : '/'}${path}`
    const query = (entry.req_query ?? []).filter(isPlainObject).map((item) => ({ key: String(item.name ?? ''), value: String(item.value ?? ''), enabled: true }))
    const headers = (entry.req_headers ?? []).filter(isPlainObject).map((item) => ({ key: String(item.name ?? ''), value: String(item.value ?? ''), enabled: true }))
    let body = { type: 'none', text: '', fields: [] }
    const bodyType = String(entry.req_body_type ?? '')
    if (bodyType === 'form' || Array.isArray(entry.req_body_form)) {
      const fields = (entry.req_body_form ?? []).filter(isPlainObject).map((item) => ({ key: String(item.name ?? ''), value: String(item.value ?? ''), enabled: true }))
      body = { type: 'form', text: new URLSearchParams(fields.map((item) => [item.key, item.value])).toString(), fields }
    } else if (bodyType === 'json' || entry.req_body_other) {
      body = { type: 'json', text: String(entry.req_body_other ?? ''), fields: [] }
    } else if (entry.req_body_other) {
      body = { type: 'text', text: String(entry.req_body_other), fields: [] }
    }
    return {
      name: String(entry.title ?? entry.name ?? 'YApi request'),
      description: String(entry.desc ?? entry.description ?? ''),
      folder: String(entry.catid ?? entry.tag ?? 'YApi'),
      method: String(entry.method ?? 'GET').toUpperCase(),
      url,
      headers,
      query,
      body,
      auth: { type: 'none' },
      tests: [],
    }
  })
}

function parseCurl(text) {
  const tokens = shellTokens(text)
  const args = tokens[0] === 'curl' || tokens[0] === 'curl.exe' ? tokens.slice(1) : tokens
  let method = ''
  let url = ''
  const headers = []
  const data = []
  const forms = []
  let cookie = ''
  let basic = ''
  let bodyFromData = ''
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index]
    const next = () => args[++index] ?? ''
    if (token === '-X' || token === '--request') method = next()
    else if (token.startsWith('--request=')) method = token.slice('--request='.length)
    else if (token === '-H' || token === '--header') { const value = next(); const colon = value.indexOf(':'); if (colon > 0) headers.push({ key: value.slice(0, colon).trim(), value: value.slice(colon + 1).trim(), enabled: true }) }
    else if (token.startsWith('--header=')) { const value = token.slice('--header='.length); const colon = value.indexOf(':'); if (colon > 0) headers.push({ key: value.slice(0, colon).trim(), value: value.slice(colon + 1).trim(), enabled: true }) }
    else if (token === '-d' || token === '--data' || token === '--data-raw' || token === '--data-binary') data.push(next())
    else if (token.startsWith('--data-raw=') || token.startsWith('--data=')) data.push(token.slice(token.indexOf('=') + 1))
    else if (token === '-F' || token === '--form') { const value = next(); const equals = value.indexOf('='); if (equals > 0) { const rawValue = value.slice(equals + 1); if (rawValue.startsWith('@') || rawValue.startsWith('<')) forms.push({ key: value.slice(0, equals), value: '', enabled: true, type: 'file', filename: rawValue.slice(1).split(';')[0], contentType: '', data: '' }); else forms.push({ key: value.slice(0, equals), value: rawValue, enabled: true, type: 'text' }) } }
    else if (token === '-b' || token === '--cookie') cookie = next()
    else if (token === '-u' || token === '--user') basic = next()
    else if (token === '-A' || token === '--user-agent') headers.push({ key: 'User-Agent', value: next(), enabled: true })
    else if (token === '-e' || token === '--referer') headers.push({ key: 'Referer', value: next(), enabled: true })
    else if (token === '--url') url = next()
    else if (token.startsWith('--url=')) url = token.slice(6)
    else if (token === '--json') { bodyFromData = next(); if (!headers.some((entry) => entry.key.toLowerCase() === 'content-type')) headers.push({ key: 'content-type', value: 'application/json', enabled: true }) }
    else if (token === '--compressed' || token === '-k' || token === '--insecure' || token === '-L' || token === '--location' || token === '-s' || token === '--silent' || token === '-i' || token === '--include') continue
    else if (!token.startsWith('-') && url.length === 0) url = token
  }
  if (url.length === 0) throw new StudioError('cURL 中未找到 URL', 400)
  const split = splitUrlQuery(url)
  const cookieEntries = cookie.length > 0
    ? cookie.split(';').map((entry) => entry.trim()).filter(Boolean).map((entry) => { const equals = entry.indexOf('='); return { key: equals > 0 ? entry.slice(0, equals) : entry, value: equals > 0 ? entry.slice(equals + 1) : '', enabled: true } })
    : []
  let bodyText = data.length > 0 ? data.join('&') : bodyFromData
  if (forms.length > 0) {
    const form = new URLSearchParams()
    for (const entry of forms) form.append(entry.key, entry.value)
    bodyText = form.toString()
  }
  const contentType = headers.find((entry) => entry.key.toLowerCase() === 'content-type')?.value
  const body = bodyText.length > 0 || forms.length > 0 ? bodyFromContentType(contentType, bodyText, forms) : { type: 'none', text: '', fields: [] }
  const auth = basic.length > 0 ? { type: 'basic', username: basic.split(':')[0] ?? '', password: basic.split(':').slice(1).join(':') } : { type: 'none' }
  const path = (() => { try { return new URL(split.url).pathname } catch { return split.url } })()
  return {
    name: path.split('/').filter(Boolean).pop() || 'cURL request',
    method: (method || (body.type === 'none' ? 'GET' : 'POST')).toUpperCase(),
    url: split.url,
    headers,
    query: split.query,
    cookies: cookieEntries,
    body,
    auth,
    tests: [],
  }
}

function parseOpenApiDocument(text) {
  let document
  try { document = JSON.parse(text) } catch { document = parseYaml(text) }
  if (!isPlainObject(document)) throw new StudioError('OpenAPI 文档格式无效', 400)
  const swagger2 = document.swagger === '2.0'
  const base = swagger2
    ? `${(document.schemes?.[0] ?? 'https')}://${document.host ?? ''}${document.basePath ?? ''}`
    : String(document.servers?.[0]?.url ?? '')
  const paths = isPlainObject(document.paths) ? document.paths : {}
  const results = []
  const methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']
  for (const [rawPath, pathItem] of Object.entries(paths)) {
    if (!isPlainObject(pathItem)) continue
    for (const method of methods) {
      const operation = pathItem[method]
      if (!isPlainObject(operation)) continue
      const path = rawPath.replace(/\{([^}]+)\}/g, '{{$1}}')
      const fullUrl = `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
      const headers = []
      const query = []
      const parameters = [...(Array.isArray(pathItem.parameters) ? pathItem.parameters : []), ...(Array.isArray(operation.parameters) ? operation.parameters : [])]
      let body = { type: 'none', text: '', fields: [] }
      for (const parameter of parameters) {
        if (!isPlainObject(parameter)) continue
        if (parameter.in === 'query') query.push({ key: String(parameter.name ?? ''), value: String(parameter.example ?? parameter.schema?.default ?? parameter.default ?? ''), enabled: true })
        else if (parameter.in === 'header') {
          const value = parameter.example ?? parameter.schema?.default ?? parameter.default
          if (value !== undefined) headers.push({ key: String(parameter.name ?? ''), value: String(value), enabled: true })
        } else if (swagger2 && parameter.in === 'body' && isPlainObject(parameter.schema)) {
          const example = parameter.schema.example ?? parameter.schema.default
          body = { type: 'json', text: example !== undefined ? JSON.stringify(example, null, 2) : '', fields: [] }
        }
      }
      if (!swagger2 && isPlainObject(operation.requestBody)) {
        const content = isPlainObject(operation.requestBody.content) ? operation.requestBody.content : {}
        const mediaType = Object.keys(content).find((entry) => entry.includes('json')) ?? Object.keys(content)[0]
        const media = mediaType ? content[mediaType] : undefined
        if (isPlainObject(media)) {
          const example = media.example ?? media.schema?.example ?? media.schema?.default
          const multipart = String(mediaType ?? '').includes('multipart')
          const type = String(mediaType ?? '').includes('json') ? 'json' : String(mediaType ?? '').includes('x-www-form-urlencoded') ? 'form' : multipart ? 'multipart' : 'text'
          const fields = multipart && isPlainObject(media.schema?.properties)
            ? Object.entries(media.schema.properties).map(([key, schema]) => schema?.format === 'binary' ? { key, value: '', enabled: true, type: 'file', filename: '', contentType: '', data: '' } : { key, value: String(schema?.example ?? schema?.default ?? ''), enabled: true, type: 'text' })
            : []
          body = { type, text: example !== undefined ? (typeof example === 'string' ? example : JSON.stringify(example, null, 2)) : '', fields }
        }
      }
      if (body.type === 'none' && swagger2 && Array.isArray(operation.consumes) && operation.consumes.some((entry) => String(entry).includes('json'))) body = { type: 'json', text: '', fields: [] }
      results.push({
        name: String(operation.summary ?? operation.operationId ?? `${method.toUpperCase()} ${rawPath}`),
        description: String(operation.description ?? ''),
        folder: Array.isArray(operation.tags) && operation.tags.length > 0 ? String(operation.tags[0]) : '',
        method: method.toUpperCase(),
        url: fullUrl,
        headers,
        query,
        body,
        auth: { type: 'none' },
        tests: [],
      })
    }
  }
  return results
}

function postmanUrl(value) {
  if (typeof value === 'string') return value
  if (!isPlainObject(value)) return ''
  if (typeof value.raw === 'string') return value.raw
  const protocol = value.protocol ? `${value.protocol}://` : ''
  const host = Array.isArray(value.host) ? value.host.join('.') : String(value.host ?? '')
  const path = Array.isArray(value.path) ? value.path.join('/') : String(value.path ?? '')
  return `${protocol}${host}${path.startsWith('/') ? '' : '/'}${path}`
}

function parsePostmanCollection(text) {
  let document
  try { document = JSON.parse(text) } catch { throw new StudioError('Postman Collection JSON 解析失败', 400) }
  const results = []
  const walk = (items, folder) => {
    if (!Array.isArray(items)) return
    for (const item of items) {
      if (!isPlainObject(item)) continue
      const nextFolder = folder.length > 0 ? `${folder}/${item.name ?? ''}`.replace(/\/$/, '') : String(item.name ?? '')
      if (Array.isArray(item.item)) { walk(item.item, nextFolder); continue }
      if (!isPlainObject(item.request)) continue
      const request = item.request
      const rawUrl = postmanUrl(request.url)
      const split = splitUrlQuery(rawUrl)
      const headers = headerEntriesFromHeaders(request.header)
      let query = []
      if (isPlainObject(request.url) && Array.isArray(request.url.query)) {
        for (const entry of request.url.query) if (isPlainObject(entry) && entry.disabled !== true) query.push({ key: String(entry.key ?? ''), value: String(entry.value ?? ''), enabled: true })
      }
      if (query.length === 0) query = split.query
      const requestUrl = query.length > 0 && rawUrl.includes('?') ? rawUrl.slice(0, rawUrl.indexOf('?')) : split.url
      const contentType = headers.find((entry) => entry.key.toLowerCase() === 'content-type')?.value
      let body = { type: 'none', text: '', fields: [] }
      if (isPlainObject(request.body)) {
        if (request.body.mode === 'raw') body = bodyFromContentType(request.body.options?.raw?.language === 'json' ? 'application/json' : contentType, request.body.raw ?? '')
        else if (request.body.mode === 'urlencoded') {
          const fields = (request.body.urlencoded ?? []).filter(isPlainObject).map((entry) => ({ key: String(entry.key ?? ''), value: String(entry.value ?? ''), enabled: entry.disabled !== true }))
          const form = new URLSearchParams()
          for (const entry of fields) if (entry.enabled) form.append(entry.key, entry.value)
          body = { type: 'form', text: form.toString(), fields }
        } else if (request.body.mode === 'formdata') {
          const fields = (request.body.formdata ?? []).filter(isPlainObject).map((entry) => entry.type === 'file' ? { key: String(entry.key ?? ''), value: '', enabled: entry.disabled !== true, type: 'file', filename: String(Array.isArray(entry.src) ? entry.src[0] ?? '' : entry.src ?? ''), contentType: '', data: '' } : { key: String(entry.key ?? ''), value: String(entry.value ?? ''), enabled: entry.disabled !== true, type: 'text' })
          body = { type: 'multipart', text: '', fields }
        }
      }
      const auth = { type: 'none' }
      if (isPlainObject(request.auth)) {
        const getAuth = (values) => Object.fromEntries((values ?? []).map((entry) => [entry.key, entry.value]))
        if (request.auth.type === 'bearer') { const values = getAuth(request.auth.bearer); auth.type = 'bearer'; auth.token = values.token ?? '' }
        if (request.auth.type === 'basic') { const values = getAuth(request.auth.basic); auth.type = 'basic'; auth.username = values.username ?? ''; auth.password = values.password ?? '' }
        if (request.auth.type === 'apikey') { const values = getAuth(request.auth.apikey); auth.type = 'apiKey'; auth.key = values.key ?? ''; auth.value = values.value ?? ''; auth.in = values.in === 'query' ? 'query' : 'header' }
      }
      results.push({ name: String(item.name ?? request.name ?? 'Postman request'), description: typeof request.description === 'string' ? request.description : '', folder, method: String(request.method ?? 'GET').toUpperCase(), url: requestUrl, headers, query, body, auth, tests: [] })
    }
  }
  walk(document.item, '')
  return results
}

function parseHarDocument(text) {
  let document
  try { document = JSON.parse(text) } catch { throw new StudioError('HAR JSON 解析失败', 400) }
  const entries = document?.log?.entries
  if (!Array.isArray(entries)) throw new StudioError('HAR 缺少 log.entries', 400)
  return entries.filter(isPlainObject).map((entry) => {
    const request = isPlainObject(entry.request) ? entry.request : {}
    const split = splitUrlQuery(request.url ?? '')
    const headers = (request.headers ?? []).filter(isPlainObject).map((header) => ({ key: String(header.name ?? ''), value: String(header.value ?? ''), enabled: true }))
    let query = (request.queryString ?? []).filter(isPlainObject).map((item) => ({ key: String(item.name ?? ''), value: String(item.value ?? ''), enabled: true }))
    if (query.length === 0) query = split.query
    const contentType = headers.find((header) => header.key.toLowerCase() === 'content-type')?.value
    let body = { type: 'none', text: '', fields: [] }
    if (isPlainObject(request.postData)) {
      if (Array.isArray(request.postData.params)) {
        const fields = request.postData.params.filter(isPlainObject).map((item) => item.fileName ? { key: String(item.name ?? ''), value: '', enabled: true, type: 'file', filename: String(item.fileName), contentType: String(item.mimeType ?? ''), data: '' } : { key: String(item.name ?? ''), value: String(item.value ?? ''), enabled: true, type: 'text' })
        const multipart = fields.some((item) => item.type === 'file') || String(request.postData.mimeType ?? '').includes('multipart')
        body = { type: multipart ? 'multipart' : 'form', text: new URLSearchParams(fields.filter((item) => item.type !== 'file').map((item) => [item.key, item.value])).toString(), fields }
      } else if (typeof request.postData.text === 'string') {
        body = bodyFromContentType(contentType ?? request.postData.mimeType, request.postData.text)
      }
    }
    const path = (() => { try { return new URL(request.url ?? '').pathname } catch { return split.url } })()
    return {
      name: path.split('/').filter(Boolean).pop() || 'HAR request',
      description: '',
      folder: 'HAR',
      method: String(request.method ?? 'GET').toUpperCase(),
      url: split.url,
      headers,
      query,
      body,
      auth: { type: 'none' },
      tests: [],
    }
  })
}

function detectImportSource(text) {
  const trimmed = String(text ?? '').trim()
  if (/^curl(\.exe)?\s/i.test(trimmed)) return 'curl'
  if (/^(openapi|swagger)\s*:/im.test(trimmed)) return 'openapi'
  let document
  try { document = JSON.parse(trimmed) } catch { return 'openapi' }
  if (Array.isArray(document)) {
    if (document.some((entry) => isPlainObject(entry) && (entry._type === 'request' || entry._type === 'request_group'))) return 'insomnia'
    return 'yapi'
  }
  if (isPlainObject(document)) {
    if (document.info?.schema?.includes('postman')) return 'postman'
    if (document.log?.entries) return 'har'
    if (document.openapi || document.swagger) return 'openapi'
    if (document._type === 'export' && Array.isArray(document.resources)) return 'insomnia'
    if (Array.isArray(document.resources)) return 'insomnia'
    if (document._type === 'environment' && isPlainObject(document.data)) return 'insomnia-env'
    if (Array.isArray(document.values) && document._postman_variable_scope === 'environment') return 'postman-env'
    if (document.variables || document.environments) return 'workspace'
    if (document.paths) return 'openapi'
  }
  return 'openapi'
}

async function importData(ctx, params) {
  let source = String(params.source ?? params.kind ?? '').toLowerCase()
  const text = typeof params.text === 'string' ? params.text : ''
  if (text.trim().length === 0) throw new StudioError('导入内容不能为空', 400)
  if (source === 'auto' || source.length === 0) source = detectImportSource(text)
  if (source === 'workspace') {
    let document
    try { document = JSON.parse(text) } catch { throw new StudioError('Workspace JSON 解析失败', 400) }
    if (!isPlainObject(document)) throw new StudioError('Workspace JSON 必须是对象', 400)
    const store = await ensureStore(ctx)
    const current = await readWorkspace(store)
    const variables = isPlainObject(document.variables) ? normalizeVariables(document.variables) : current.variables
    const environments = normalizeEnvironments(document.environments, variables)
    const activeEnvironmentId = environments.some((entry) => entry.id === document.activeEnvironmentId) ? document.activeEnvironmentId : environments[0].id
    const saved = await writeWorkspace(store, {
      ...current,
      variables,
      environments,
      activeEnvironmentId,
      globalHeaders: document.globalHeaders !== undefined ? asEntries(document.globalHeaders) : current.globalHeaders,
      globalQuery: document.globalQuery !== undefined ? asEntries(document.globalQuery) : current.globalQuery,
    })
    return { source, count: 0, workspace: saved }
  }
  if (source === 'postman-env') {
    let document
    try { document = JSON.parse(text) } catch { throw new StudioError('Postman 环境 JSON 解析失败', 400) }
    if (!isPlainObject(document) || !Array.isArray(document.values)) throw new StudioError('Postman 环境文件缺少 values', 400)
    const mergeStrategy = params.mergeStrategy === 'replace' ? 'replace' : 'merge'
    const incoming = {}
    for (const entry of document.values) {
      if (!isPlainObject(entry) || entry.enabled === false || typeof entry.key !== 'string' || entry.key.trim().length === 0) continue
      incoming[entry.key.trim()] = String(entry.value ?? '')
    }
    const store = await ensureStore(ctx)
    const current = await readWorkspace(store)
    const environments = current.environments.map((environment) => environment.id === current.activeEnvironmentId ? { ...environment, variables: mergeStrategy === 'replace' ? incoming : { ...environment.variables, ...incoming } } : environment)
    const saved = await writeWorkspace(store, { ...current, environments })
    return { source, count: 0, workspace: saved, imported: Object.keys(incoming).length, mergeStrategy }
  }
  if (source === 'insomnia-env') {
    let document
    try { document = JSON.parse(text) } catch { throw new StudioError('Insomnia 环境 JSON 解析失败', 400) }
    if (!isPlainObject(document) || !isPlainObject(document.data)) throw new StudioError('Insomnia 环境文件缺少 data', 400)
    const mergeStrategy = params.mergeStrategy === 'replace' ? 'replace' : 'merge'
    const incoming = normalizeVariables(document.data)
    const store = await ensureStore(ctx)
    const current = await readWorkspace(store)
    const environments = current.environments.map((environment) => environment.id === current.activeEnvironmentId ? { ...environment, variables: mergeStrategy === 'replace' ? incoming : { ...environment.variables, ...incoming } } : environment)
    const saved = await writeWorkspace(store, { ...current, environments })
    return { source, count: 0, workspace: saved, imported: Object.keys(incoming).length, mergeStrategy }
  }
  let parsed
  if (source === 'curl') parsed = [parseCurl(text)]
  else if (source === 'openapi' || source === 'swagger') parsed = parseOpenApiDocument(text)
  else if (source === 'postman') parsed = parsePostmanCollection(text)
  else if (source === 'har') parsed = parseHarDocument(text)
  else if (source === 'insomnia') parsed = parseInsomniaDocument(text)
  else if (source === 'yapi') parsed = parseYApiDocument(text)
  else throw new StudioError(`不支持的导入来源 "${source}"`, 400)
  if (!Array.isArray(parsed) || parsed.length === 0) throw new StudioError('没有解析到可导入的接口', 400)
  const saved = []
  for (const entry of parsed) {
    saved.push(await saveRequestFromInput(ctx, entry))
  }
  return { source, count: saved.length, requests: saved }
}

async function exportData(ctx, params) {
  const target = String(params.target ?? params.kind ?? 'openapi').toLowerCase()
  const requests = await listRequests(ctx)
  if (target === 'curl') {
    const request = typeof params.requestId === 'string'
      ? requests.find((entry) => entry.id === params.requestId)
      : requests[0]
    if (!request) throw new StudioError('没有可导出的接口', 404)
    return { target, filename: `${request.name || 'request'}.sh`, data: exportCurl(request) }
  }
  if (target === 'workspace') {
    const workspace = await readWorkspace(await ensureStore(ctx))
    return { target, filename: 'airpost-workspace.json', data: JSON.stringify({ version: 2, variables: workspace.variables, environments: workspace.environments, activeEnvironmentId: workspace.activeEnvironmentId, globalHeaders: workspace.globalHeaders, globalQuery: workspace.globalQuery }, null, 2) }
  }
  if (target === 'postman') {
    return { target, filename: 'airpost.postman_collection.json', data: JSON.stringify(exportPostman(requests, await listFlows(ctx)), null, 2) }
  }
  if (target === 'postman-env') {
    const workspace = await readWorkspace(await ensureStore(ctx))
    const environment = workspace.environments.find((entry) => entry.id === workspace.activeEnvironmentId)
    const values = { ...workspace.variables, ...(environment?.variables ?? {}) }
    return {
      target,
      filename: `airpost-${(environment?.name || 'environment').replace(/[^a-zA-Z0-9_-]+/g, '-')}.postman_environment.json`,
      data: JSON.stringify({
        id: `airpost-${environment?.id || 'default'}`,
        name: `AirPost ${environment?.name || 'Default'}`,
        values: Object.entries(values).map(([key, value]) => ({ key, value: String(value), type: 'default', enabled: true })),
        _postman_variable_scope: 'environment',
      }, null, 2),
    }
  }
  if (target === 'insomnia-env') {
    const workspace = await readWorkspace(await ensureStore(ctx))
    const environment = workspace.environments.find((entry) => entry.id === workspace.activeEnvironmentId)
    return {
      target,
      filename: `airpost-${(environment?.name || 'environment').replace(/[^a-zA-Z0-9_-]+/g, '-')}.insomnia_environment.json`,
      data: JSON.stringify({ _type: 'environment', _id: `env_${environment?.id || 'default'}`, parentId: 'wrk_airpost', name: `AirPost ${environment?.name || 'Default'}`, data: { ...workspace.variables, ...(environment?.variables ?? {}) } }, null, 2),
    }
  }
  if (target === 'insomnia') {
    return { target, filename: 'airpost-insomnia.json', data: JSON.stringify(exportInsomnia(requests), null, 2) }
  }
  if (target === 'yapi') {
    return { target, filename: 'airpost-yapi.json', data: JSON.stringify(exportYApi(requests), null, 2) }
  }
  if (target === 'openapi') {
    return { target, filename: 'airpost.openapi.json', data: JSON.stringify(exportOpenApi(requests, await readWorkspace(await ensureStore(ctx))), null, 2) }
  }
  if (target === 'markdown') {
    return { target, filename: 'airpost-api.md', data: exportMarkdown(requests, await listFlows(ctx), await readWorkspace(await ensureStore(ctx))) }
  }
  if (target === 'html') {
    return { target, filename: 'airpost-api.html', data: exportHtml(requests, await listFlows(ctx), await readWorkspace(await ensureStore(ctx))) }
  }
  throw new StudioError(`不支持的导出目标 "${target}"`, 400)
}

function shellQuote(value) {
  return `'${String(value ?? '').replace(/'/g, `'\\''`)}'`
}

function exportCurl(request) {
  const lines = []
  const method = (request.method || 'GET').toUpperCase()
  if (method !== 'GET') lines.push(`-X ${method}`)
  let url = request.url
  const query = (request.query ?? []).filter((entry) => entry.enabled !== false && entry.key.trim().length > 0)
  if (query.length > 0) url += `${url.includes('?') ? '&' : '?'}${query.map((entry) => `${encodeURIComponent(entry.key)}=${encodeURIComponent(entry.value)}`).join('&')}`
  lines.push(shellQuote(url))
  const headers = (request.headers ?? []).filter((entry) => entry.enabled !== false && entry.key.trim().length > 0)
  for (const header of headers) lines.push(`-H ${shellQuote(`${header.key}: ${header.value}`)}`)
  const cookies = (request.cookies ?? []).filter((entry) => entry.enabled !== false && entry.key.trim().length > 0)
  if (cookies.length > 0) lines.push(`-b ${shellQuote(cookies.map((entry) => `${entry.key}=${entry.value}`).join('; '))}`)
  const auth = request.auth ?? { type: 'none' }
  if (auth.type === 'bearer' && auth.token) lines.push(`-H ${shellQuote(`Authorization: Bearer ${auth.token}`)}`)
  if (auth.type === 'basic' && (auth.username || auth.password)) lines.push(`-u ${shellQuote(`${auth.username}:${auth.password}`)}`)
  if (auth.type === 'apiKey' && auth.key && auth.in !== 'query') lines.push(`-H ${shellQuote(`${auth.key}: ${auth.value}`)}`)
  if (['digest', 'oauth1', 'oauth2', 'hawk', 'aws'].includes(auth.type)) lines.push(`# Auth type "${auth.type}" is configured in AirPost; run or export OpenAPI/Postman for full auth metadata.`)
  if (request.body?.type !== 'none') {
    if (request.body.type === 'multipart') {
      for (const entry of request.body.fields ?? []) {
        if (entry.enabled === false || entry.key.trim().length === 0) continue
        if (entry.type === 'file') lines.push(`-F ${shellQuote(`${entry.key}=@${entry.filename || entry.key}`)}`)
        else lines.push(`-F ${shellQuote(`${entry.key}=${entry.value}`)}`)
      }
    } else if (request.body.type === 'form' && (request.body.fields ?? []).some((entry) => entry.enabled !== false && entry.key.trim().length > 0)) {
      const form = new URLSearchParams()
      for (const entry of request.body.fields) if (entry.enabled !== false && entry.key.trim().length > 0) form.append(entry.key, entry.value)
      lines.push(`--data-raw ${shellQuote(form.toString())}`)
    } else if (request.body.text.length > 0) {
      lines.push(`--data-raw ${shellQuote(request.body.text)}`)
    }
  }
  return `curl \\\n  ${lines.join(' \\\n  ')}`
}

function postmanTestLines(test) {
  const label = test.name || `${test.type} ${test.op || ''}`.trim() || 'assertion'
  const value = test.value ?? ''
  const path = String(test.path ?? '').replace(/'/g, "\\'")
  if (test.type === 'status') return [`pm.test(${JSON.stringify(label)}, function () { pm.response.to.have.status(${Number(value) || 200}); });`]
  if (test.type === 'latency') return [`pm.test(${JSON.stringify(label)}, function () { pm.expect(pm.response.responseTime).to.be.below(${Number(value) || 0}); });`]
  if (test.type === 'header') return [`pm.test(${JSON.stringify(label)}, function () { pm.expect(pm.response.headers.get(${JSON.stringify(String(test.header ?? ''))})).to.include(${JSON.stringify(String(value))}); });`]
  if (test.type === 'body') return [`pm.test(${JSON.stringify(label)}, function () { pm.expect(pm.response.text()).to.include(${JSON.stringify(String(value))}); });`]
  if (test.type === 'json') {
    const op = test.op || 'contains'
    const expression = `_.get(pm.response.json(), ${JSON.stringify(path)})`
    if (op === 'exists') return [`pm.test(${JSON.stringify(label)}, function () { pm.expect(${expression}).to.not.be.undefined; });`]
    if (op === 'eq') return [`pm.test(${JSON.stringify(label)}, function () { pm.expect(${expression}).to.eql(${JSON.stringify(value)}); });`]
    if (op === 'type') return [`pm.test(${JSON.stringify(label)}, function () { pm.expect(${expression}).to.be.a(${JSON.stringify(String(value))}); });`]
    if (op === 'gt' || op === 'lt' || op === 'gte' || op === 'lte') {
      const method = op === 'gt' ? 'above' : op === 'lt' ? 'below' : op === 'gte' ? 'least' : 'most'
      return [`pm.test(${JSON.stringify(label)}, function () { pm.expect(${expression}).to.be.${method}(${Number(value) || 0}); });`]
    }
    return [`pm.test(${JSON.stringify(label)}, function () { pm.expect(String(${expression})).to.include(${JSON.stringify(String(value))}); });`]
  }
  if (test.type === 'schema' && test.schema) return [`pm.test(${JSON.stringify(label)}, function () { pm.response.to.have.jsonSchema(${JSON.stringify(test.schema)}); });`]
  if (test.type === 'script' && test.code) {
    const code = String(test.code).split('\n').map((line) => `  ${line}`).join('\n')
    return [
      'pm.test("AirPost custom script", function () {',
      '  const response = { status: pm.response.code, body: pm.response.text(), headers: pm.response.headers };',
      '  let json; try { json = pm.response.json(); response.json = json; } catch (error) { json = undefined; }',
      '  const variables = new Proxy({}, { get: function (target, key) { return pm.variables.get(String(key)); } });',
      '  (function () {',
      code,
      '  })();',
      '});',
    ]
  }
  return []
}

function exportPostman(requests, flows) {
  const buildRequest = (request) => {
    const headers = (request.headers ?? []).filter((entry) => entry.enabled !== false && entry.key.trim().length > 0).map((entry) => ({ key: entry.key, value: String(entry.value) }))
    const query = (request.query ?? []).filter((entry) => entry.enabled !== false && entry.key.trim().length > 0).map((entry) => ({ key: entry.key, value: String(entry.value), disabled: false }))
    const url = request.url
    const item = {
      name: request.name,
      request: {
        method: request.method,
        header: headers,
        url: {
          raw: url,
          ...(query.length > 0 ? { query } : {}),
        },
        description: request.description || undefined,
      },
    }
    const testLines = (request.tests ?? []).filter((test) => test.enabled !== false).flatMap(postmanTestLines)
    if (testLines.length > 0) item.event = [{ listen: 'test', script: { type: 'text/javascript', exec: testLines } }]
    if (request.body?.type === 'multipart') {
      item.request.body = { mode: 'formdata', formdata: (request.body.fields ?? []).filter((entry) => entry.enabled !== false).map((entry) => entry.type === 'file' ? { key: entry.key, type: 'file', src: entry.filename ? [entry.filename] : [] } : { key: entry.key, value: String(entry.value ?? ''), type: 'text' }) }
    } else if (request.body?.type === 'json' || request.body?.type === 'text') {
      item.request.body = { mode: 'raw', raw: request.body.text, options: request.body.type === 'json' ? { raw: { language: 'json' } } : { raw: { language: 'text' } } }
    } else if (request.body?.type === 'form' && (request.body.fields ?? []).length > 0) {
      item.request.body = { mode: 'urlencoded', urlencoded: request.body.fields.filter((entry) => entry.enabled !== false).map((entry) => ({ key: entry.key, value: String(entry.value), type: 'text' })) }
    }
    const auth = request.auth ?? { type: 'none' }
    if (auth.type === 'bearer' && auth.token) item.request.auth = { type: 'bearer', bearer: [{ key: 'token', value: auth.token, type: 'string' }] }
    if (auth.type === 'basic') item.request.auth = { type: 'basic', basic: [{ key: 'username', value: auth.username, type: 'string' }, { key: 'password', value: auth.password, type: 'string' }] }
    if (auth.type === 'apiKey' && auth.key) item.request.auth = { type: 'apikey', apikey: [{ key: 'key', value: auth.key, type: 'string' }, { key: 'value', value: auth.value, type: 'string' }, { key: 'in', value: auth.in === 'query' ? 'query' : 'header', type: 'string' }] }
    return item
  }
  const groups = new Map()
  for (const request of requests) {
    const folder = request.folder || 'Ungrouped'
    if (!groups.has(folder)) groups.set(folder, [])
    groups.get(folder).push(buildRequest(request))
  }
  return {
    info: { name: 'AirPost Collection', description: 'Exported from AirPost.', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' },
    item: [...groups.entries()].map(([name, items]) => ({ name, item: items })),
    variable: [],
  }
}

function exportInsomnia(requests) {
  const workspaceId = 'wrk_airpost'
  const groups = [...new Set(requests.map((request) => request.folder || 'Ungrouped'))]
  const resources = [
    { _id: workspaceId, _type: 'workspace', name: 'AirPost', description: 'Exported from AirPost.' },
    ...groups.map((folder, index) => ({ _id: `fld_airpost_${index}`, _type: 'request_group', parentId: workspaceId, name: folder })),
  ]
  for (const request of requests) {
    const folderIndex = groups.indexOf(request.folder || 'Ungrouped')
    const query = (request.query ?? []).filter((entry) => entry.enabled !== false).map((entry) => `${encodeURIComponent(entry.key)}=${encodeURIComponent(entry.value)}`).join('&')
    const url = query.length > 0 ? `${request.url}${request.url.includes('?') ? '&' : '?'}${query}` : request.url
    const headers = (request.headers ?? []).filter((entry) => entry.enabled !== false).map((entry) => ({ name: entry.key, value: entry.value }))
    const resource = {
      _id: request.id,
      _type: 'request',
      parentId: `fld_airpost_${folderIndex}`,
      name: request.name,
      description: request.description || '',
      method: request.method,
      url,
      headers,
    }
    if (request.body?.type === 'multipart') resource.body = { mimeType: 'multipart/form-data', params: (request.body.fields ?? []).filter((entry) => entry.enabled !== false).map((entry) => ({ name: entry.key, value: entry.type === 'file' ? entry.filename || '' : String(entry.value ?? ''), type: entry.type === 'file' ? 'file' : 'text' })) }
    else if (request.body?.type === 'json') resource.body = { mimeType: 'application/json', text: request.body.text }
    else if (request.body?.type === 'form') resource.body = { mimeType: 'application/x-www-form-urlencoded', text: request.body.text, params: (request.body.fields ?? []).map((entry) => ({ name: entry.key, value: entry.value })) }
    else if (request.body?.type === 'text') resource.body = { mimeType: 'text/plain', text: request.body.text }
    if (request.auth?.type === 'bearer') resource.authentication = { type: 'bearer', token: request.auth.token }
    if (request.auth?.type === 'basic') resource.authentication = { type: 'basic', username: request.auth.username, password: request.auth.password }
    resources.push(resource)
  }
  return { _type: 'export', __export_format: 4, __export_date: new Date().toISOString(), __export_source: 'AirPost', resources }
}

function exportYApi(requests) {
  return requests.map((request) => {
    let path = request.url
    try { path = decodeURIComponent(new URL(request.url.replace(/^\{\{\s*baseUrl\s*\}\}/i, 'http://localhost')).pathname) } catch { path = request.url }
    const item = {
      title: request.name,
      path,
      method: request.method,
      desc: request.description || '',
      catid: request.folder || 'AirPost',
      req_query: (request.query ?? []).filter((entry) => entry.enabled !== false).map((entry) => ({ name: entry.key, value: entry.value, required: false })),
      req_headers: (request.headers ?? []).filter((entry) => entry.enabled !== false).map((entry) => ({ name: entry.key, value: entry.value, required: false })),
      req_body_type: 'raw',
      req_body_other: '',
    }
    if (request.body?.type === 'json') { item.req_body_type = 'json'; item.req_body_other = request.body.text }
    else if (request.body?.type === 'form') { item.req_body_type = 'form'; item.req_body_form = (request.body.fields ?? []).filter((entry) => entry.enabled !== false).map((entry) => ({ name: entry.key, value: entry.value, type: 'text' })) }
    else if (request.body?.type === 'text') { item.req_body_type = 'raw'; item.req_body_other = request.body.text }
    return item
  })
}

function exportOpenApi(requests, workspace) {
  const base = activeEnvironmentVariables(workspace).baseUrl || workspace.variables.baseUrl || ''
  const document = {
    openapi: '3.0.3',
    info: { title: 'AirPost API', version: '1.0.0', description: 'Exported from AirPost.' },
    servers: base ? [{ url: base }] : [],
    paths: {},
  }
  for (const request of requests) {
    const rawUrl = request.url.replace(/\{\{\s*baseUrl\s*\}\}/gi, base)
    let parsed
    try { parsed = new URL(rawUrl) } catch { parsed = new URL(rawUrl.startsWith('/') ? `http://localhost${rawUrl}` : `http://localhost/${rawUrl}`) }
    let pathName = parsed.pathname || '/'
    try { pathName = decodeURIComponent(pathName) } catch {}
    pathName = pathName.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, '{$1}')
    if (!document.paths[pathName]) document.paths[pathName] = {}
    const operation = {
      summary: request.name,
      description: request.description || undefined,
      tags: request.folder ? [request.folder] : undefined,
      parameters: [],
      responses: {},
    }
    for (const match of pathName.matchAll(/\{([^}]+)\}/g)) {
      operation.parameters.push({ name: match[1], in: 'path', required: true, schema: { type: 'string' } })
    }
    for (const entry of request.query) {
      if (entry.enabled === false || entry.key.trim().length === 0) continue
      operation.parameters.push({ name: entry.key, in: 'query', required: false, schema: { type: 'string' }, example: entry.value })
    }
    for (const entry of request.headers) {
      if (entry.enabled === false || entry.key.trim().length === 0 || entry.key.toLowerCase() === 'content-type') continue
      operation.parameters.push({ name: entry.key, in: 'header', required: false, schema: { type: 'string' }, example: entry.value })
    }
    if (request.body?.type !== 'none') {
      const type = request.body.type
      if (type === 'json') {
        let example
        try { example = JSON.parse(renderValue(request.body.text, {}, [])) } catch { example = request.body.text }
        operation.requestBody = { content: { 'application/json': { schema: { type: typeof example === 'object' && example !== null ? 'object' : 'string' }, example } } }
      } else if (type === 'multipart') {
        const properties = {}
        for (const field of request.body.fields ?? []) {
          if (field.enabled === false || field.key.trim().length === 0) continue
          properties[field.key] = field.type === 'file' ? { type: 'string', format: 'binary' } : { type: 'string' }
        }
        operation.requestBody = { content: { 'multipart/form-data': { schema: { type: 'object', properties } } } }
      } else if (type === 'form') {
        const properties = {}
        const required = []
        for (const field of request.body.fields ?? []) {
          if (field.enabled === false || field.key.trim().length === 0) continue
          properties[field.key] = { type: 'string' }
          required.push(field.key)
        }
        operation.requestBody = { content: { 'application/x-www-form-urlencoded': { schema: { type: 'object', properties, ...(required.length > 0 ? { required } : {}) } } } }
      } else {
        operation.requestBody = { content: { 'text/plain': { schema: { type: 'string' }, example: request.body.text } } }
      }
    }
    const example = (request.examples ?? [])[0]
    operation.responses['200'] = {
      description: 'Successful response',
      ...(example ? { content: { 'application/json': { examples: { [example.name || 'default']: { value: (() => { try { return JSON.parse(example.body) } catch { return example.body } })() } } } } } : {}),
    }
    document.paths[pathName][request.method.toLowerCase()] = operation
  }
  return document
}

function exportMarkdown(requests, flows, workspace) {
  const base = activeEnvironmentVariables(workspace).baseUrl || workspace.variables.baseUrl || ''
  const lines = ['# AirPost API', '']
  if (base) lines.push(`Base URL: \`${base}\``, '')
  const groups = new Map()
  for (const request of requests) {
    const folder = request.folder || 'Ungrouped'
    if (!groups.has(folder)) groups.set(folder, [])
    groups.get(folder).push(request)
  }
  for (const [folder, entries] of groups) {
    lines.push(`## ${folder}`, '')
    for (const request of entries) {
      lines.push(`### ${request.name}`, '')
      lines.push(`\`${request.method}\` \`${request.url}\``, '')
      if (request.description) lines.push(request.description, '')
      if (request.headers.length > 0) {
        lines.push('**Headers**', '', '| Name | Value |', '| --- | --- |')
        for (const header of request.headers) if (header.enabled !== false) lines.push(`| ${mdCell(header.key)} | ${mdCell(header.value)} |`)
        lines.push('')
      }
      if (request.query.length > 0) {
        lines.push('**Query**', '', '| Name | Value |', '| --- | --- |')
        for (const query of request.query) if (query.enabled !== false) lines.push(`| ${mdCell(query.key)} | ${mdCell(query.value)} |`)
        lines.push('')
      }
      if (request.body.type !== 'none') {
        lines.push(`**Body (${request.body.type})**`, '', '```', request.body.text, '```', '')
      }
      if (request.tests.length > 0) {
        lines.push('**Assertions**', '')
        for (const test of request.tests) lines.push(`- ${test.type}: ${test.op || 'contains'} ${formatValue(test.value ?? test.path ?? '')}`)
        lines.push('')
      }
      if (request.cases.length > 0) {
        lines.push(`**Cases**: ${request.cases.map((entry) => entry.name).join(', ')}`, '')
      }
      if (request.examples.length > 0) {
        lines.push('**Examples**', '')
        for (const example of request.examples) {
          lines.push(`- ${example.name} (HTTP ${example.status})`, '', '```', example.body, '```', '')
        }
      }
    }
  }
  if (flows.length > 0) {
    lines.push('## Flows', '')
    for (const flow of flows) {
      lines.push(`### ${flow.name}`, '')
      if (flow.description) lines.push(flow.description, '')
      lines.push(`Steps: ${flow.steps.length}`, '')
      for (const [index, step] of flow.steps.entries()) lines.push(`${index + 1}. ${step.name}${step.condition ? ` (if ${step.condition})` : ''}`)
      lines.push('')
    }
  }
  return lines.join('\n')
}

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

function exportHtml(requests, flows, workspace) {
  const base = activeEnvironmentVariables(workspace).baseUrl || workspace.variables.baseUrl || ''
  const esc = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const renderEntries = (entries) => entries.length === 0 ? '' : `<table><thead><tr><th>Name</th><th>Value</th></tr></thead><tbody>${entries.filter((entry) => entry.enabled !== false).map((entry) => `<tr><td>${esc(entry.key)}</td><td>${esc(entry.value)}</td></tr>`).join('')}</tbody></table>`
  const groups = new Map()
  for (const request of requests) {
    const folder = request.folder || 'Ungrouped'
    if (!groups.has(folder)) groups.set(folder, [])
    groups.get(folder).push(request)
  }
  const sections = []
  for (const [folder, entries] of groups) {
    sections.push(`<section><h2>${esc(folder)}</h2>${entries.map((request) => {
      const tests = request.tests.length === 0 ? '' : `<h4>Assertions</h4><ul>${request.tests.map((test) => `<li>${esc(test.type)} ${esc(test.op || '')} ${esc(test.value ?? test.path ?? '')}</li>`).join('')}</ul>`
      const body = request.body.type === 'none' ? '' : `<h4>Body (${esc(request.body.type)})</h4><pre>${esc(request.body.text)}</pre>`
      return `<article><h3>${esc(request.name)}</h3><p><code>${esc(request.method)}</code> <code>${esc(request.url)}</code></p>${request.description ? `<p>${esc(request.description)}</p>` : ''}${request.headers.length > 0 ? `<h4>Headers</h4>${renderEntries(request.headers)}` : ''}${request.query.length > 0 ? `<h4>Query</h4>${renderEntries(request.query)}` : ''}${body}${tests}${request.cases.length > 0 ? `<h4>Cases</h4><p>${request.cases.map((entry) => esc(entry.name)).join(', ')}</p>` : ''}${request.examples.length > 0 ? `<h4>Examples</h4>${request.examples.map((example) => `<details><summary>${esc(example.name)} · HTTP ${example.status}</summary><pre>${esc(example.body)}</pre></details>`).join('')}` : ''}</article>`
    }).join('')}</section>`)
  }
  if (flows.length > 0) {
    sections.push(`<section><h2>Flows</h2>${flows.map((flow) => `<article><h3>${esc(flow.name)}</h3>${flow.description ? `<p>${esc(flow.description)}</p>` : ''}<ol>${flow.steps.map((step) => `<li>${esc(step.name)}${step.condition ? ` <em>if ${esc(step.condition)}</em>` : ''}</li>`).join('')}</ol></article>`).join('')}</section>`)
  }
  return `<!doctype html><html><head><meta charset="utf-8"><title>AirPost API</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;max-width:980px;margin:40px auto;padding:0 24px;line-height:1.65;color:#1f2328}h1,h2,h3,h4{line-height:1.3}section{margin-top:28px}article{border-top:1px solid #d0d7de;padding-top:14px}code,pre{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:#f4f6f8;border-radius:6px}code{padding:2px 5px}pre{padding:12px;overflow:auto}table{border-collapse:collapse}td,th{border:1px solid #d0d7de;padding:4px 8px;text-align:left}</style></head><body><h1>AirPost API</h1>${base ? `<p>Base URL: <code>${esc(base)}</code></p>` : ''}${sections.join('')}</body></html>`
}

/* ------------------------------------------------------------------ */
/* Running requests                                                    */
/* ------------------------------------------------------------------ */

async function runCaseAction(ctx, params) {
  let request
  if (isPlainObject(params.request)) request = normalizeRequest(params.request, undefined, typeof params.request.id === 'string' ? params.request.id : newId('req'))
  else if (typeof params.requestId === 'string') {
    request = await readRequest(ctx, params.requestId)
    if (request === undefined) throw new StudioError(`接口 "${params.requestId}" 不存在`, 404)
  } else throw new StudioError('run_case 需要 request 或 requestId', 400)
  const caseValue = isPlainObject(params.case)
    ? params.case
    : request.cases.find((entry) => entry.id === params.caseId)
  if (!isPlainObject(caseValue)) throw new StudioError('用例不存在', 404)
  if (!isPlainObject(caseValue.overrides)) throw new StudioError('用例 overrides 必须是 JSON 对象', 400)
  const effective = normalizeRequest({ ...request, ...caseValue.overrides }, request, request.id)
  return executeSingle(ctx, effective, normalizeVariables(caseValue.variables), params.environmentId)
}

async function runRequestAction(ctx, params) {
  let request
  if (isPlainObject(params.request)) {
    request = normalizeRequest(params.request, undefined, typeof params.request.id === 'string' ? params.request.id : newId('req'))
  } else if (typeof params.requestId === 'string') {
    request = await readRequest(ctx, params.requestId)
    if (request === undefined) throw new StudioError(`接口 "${params.requestId}" 不存在`, 404)
  } else {
    throw new StudioError('run_request 需要 request 或 requestId', 400)
  }
  const extraVariables = isPlainObject(params.variables) ? normalizeVariables(params.variables) : {}
  return executeSingle(ctx, request, extraVariables, params.environmentId)
}

async function executeSingle(ctx, request, extraVariables, environmentId) {
  const store = await ensureStore(ctx)
  const workspace = await readWorkspace(store)
  const environment = typeof environmentId === 'string' ? workspace.environments.find((entry) => entry.id === environmentId) : undefined
  const id = newId('run')
  const baseVariables = environment ? { ...workspace.variables, ...environment.variables } : activeEnvironmentVariables(workspace)
  const variables = runtimeVariables(baseVariables, { ...normalizeVariables(request.variables), ...extraVariables }, id)
  const outcome = await performRequest(request, variables, workspace)
  const run = {
    id,
    kind: 'request',
    title: request.name,
    requestId: request.id,
    requestName: request.name,
    createdAt: nowIso(),
    ...outcome,
    variables: outcome.variables ?? variables,
  }
  run.summary = summarizeRun(run).summary
  await persistRun(store, run)
  return run
}

const oauthTokenCache = new Map()

function oauthEncode(value) {
  return encodeURIComponent(String(value)).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)
}

function awsEncode(value) {
  return encodeURIComponent(String(value)).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)
}

function applyAwsSignature(request, variables) {
  const auth = request.auth ?? {}
  const accessKey = renderValue(auth.awsAccessKey ?? '', variables, [])
  const secretKey = renderValue(auth.awsSecretKey ?? '', variables, [])
  const region = renderValue(auth.awsRegion ?? 'us-east-1', variables, []) || 'us-east-1'
  const service = renderValue(auth.awsService ?? 'execute-api', variables, []) || 'execute-api'
  const sessionToken = renderValue(auth.awsSessionToken ?? '', variables, [])
  const url = new URL(renderValue(request.url, variables, []))
  const body = renderValue(request.body?.text ?? '', variables, [])
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dateStamp = amzDate.slice(0, 8)
  const payloadHash = createHash('sha256').update(body).digest('hex')
  const headers = {}
  for (const entry of request.headers) {
    if (entry.enabled === false || entry.key.trim().length === 0) continue
    headers[entry.key.trim().toLowerCase()] = renderValue(entry.value, variables, [])
  }
  headers.host = url.host
  headers['x-amz-date'] = amzDate
  headers['x-amz-content-sha256'] = payloadHash
  if (sessionToken.length > 0) headers['x-amz-security-token'] = sessionToken
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map((key) => `${key}:${String(headers[key]).trim().replace(/\s+/g, ' ')}\n`)
    .join('')
  const signedHeaders = Object.keys(headers).sort().join(';')
  const canonicalQuery = [...url.searchParams.entries()]
    .map(([key, value]) => [awsEncode(key), awsEncode(value)])
    .sort((left, right) => (left[0] === right[0] ? left[1].localeCompare(right[1]) : left[0].localeCompare(right[0])))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  const canonicalRequest = `${request.method.toUpperCase()}\n${url.pathname || '/'}\n${canonicalQuery}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`
  const scope = `${dateStamp}/${region}/${service}/aws4_request`
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${scope}\n${createHash('sha256').update(canonicalRequest).digest('hex')}`
  const hmac = (key, value) => createHmac('sha256', key).update(value).digest()
  const signingKey = hmac(hmac(hmac(hmac(`AWS4${secretKey}`, dateStamp), region), service), 'aws4_request')
  const signature = createHmac('sha256', signingKey).update(stringToSign).digest('hex')
  headers.authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
  return { ...request, headers: Object.entries(headers).map(([key, value]) => ({ key, value, enabled: true })), auth: { ...auth, type: 'none' } }
}

function applyHawk(request, variables) {
  const auth = request.auth ?? {}
  const id = renderValue(auth.hawkId ?? '', variables, [])
  const key = renderValue(auth.hawkKey ?? '', variables, [])
  const ext = renderValue(auth.hawkExt ?? '', variables, [])
  const url = new URL(renderValue(request.url, variables, []))
  const timestamp = String(Math.floor(Date.now() / 1000))
  const nonce = randomUUID().replace(/-/g, '').slice(0, 12)
  const algorithm = auth.hawkAlgorithm === 'sha1' ? 'sha1' : 'sha256'
  const port = url.port || (url.protocol === 'https:' ? '443' : '80')
  const resource = `${url.pathname}${url.search}`
  let normalized = `hawk.1.header\n${timestamp}\n${nonce}\n${request.method.toUpperCase()}\n${resource}\n${url.hostname.toLowerCase()}\n${port}\n\n\n${ext}\n`
  const fields = [`id="${id.replace(/"/g, '\\"')}"`, `ts="${timestamp}"`, `nonce="${nonce}"`]
  if (auth.hawkPayloadHash === true) {
    const body = renderValue(request.body?.text ?? '', variables, [])
    const hash = createHash(algorithm).update(body).digest('base64')
    normalized += hash
    fields.push(`hash="${hash}"`)
  }
  const mac = createHmac(algorithm, key).update(normalized).digest('base64')
  fields.push(`mac="${mac}"`)
  if (ext.length > 0) fields.push(`ext="${ext.replace(/"/g, '\\"')}"`)
  const headers = [...request.headers, { key: 'authorization', value: `Hawk ${fields.join(', ')}`, enabled: true }]
  return { ...request, headers, auth: { ...auth, type: 'none' } }
}

function applyOAuth1(request, variables) {
  const auth = request.auth ?? {}
  const consumerKey = renderValue(auth.consumerKey ?? '', variables, [])
  const consumerSecret = renderValue(auth.consumerSecret ?? '', variables, [])
  const token = renderValue(auth.oauthToken ?? '', variables, [])
  const tokenSecret = renderValue(auth.oauthTokenSecret ?? '', variables, [])
  const method = String(auth.signatureMethod || 'HMAC-SHA1')
  const nonce = randomUUID().replace(/-/g, '')
  const timestamp = String(Math.floor(Date.now() / 1000))
  const oauthParams = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: method,
    oauth_timestamp: timestamp,
    oauth_version: '1.0',
  }
  if (token.length > 0) oauthParams.oauth_token = token
  const url = new URL(renderValue(request.url, variables, []))
  const baseParams = []
  for (const [key, value] of url.searchParams.entries()) baseParams.push([key, value])
  for (const [key, value] of Object.entries(oauthParams)) baseParams.push([key, value])
  const normalized = baseParams
    .map(([key, value]) => [oauthEncode(key), oauthEncode(value)])
    .sort((left, right) => (left[0] === right[0] ? left[1].localeCompare(right[1]) : left[0].localeCompare(right[0])))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  const baseUrl = `${url.protocol}//${url.host}${url.pathname}`
  const baseString = `${request.method.toUpperCase()}&${oauthEncode(baseUrl)}&${oauthEncode(normalized)}`
  const signingKey = `${oauthEncode(consumerSecret)}&${oauthEncode(tokenSecret)}`
  const signature = method === 'PLAINTEXT'
    ? signingKey
    : createHmac('sha1', signingKey).update(baseString).digest('base64')
  const headerParams = { ...oauthParams, oauth_signature: signature }
  const header = `OAuth ${Object.entries(headerParams).map(([key, value]) => `${oauthEncode(key)}="${oauthEncode(value)}"`).join(', ')}${auth.realm ? `, realm="${oauthEncode(auth.realm)}"` : ''}`
  const headers = [...request.headers, { key: 'authorization', value: header, enabled: true }]
  return { ...request, headers, auth: { ...auth, type: 'none' } }
}

async function applyOAuth(request, variables) {
  const auth = request.auth ?? {}
  if (auth.type !== 'oauth2') return request
  const missing = []
  const tokenUrl = renderValue(auth.tokenUrl ?? '', variables, missing)
  const clientId = renderValue(auth.clientId ?? '', variables, missing)
  const clientSecret = renderValue(auth.clientSecret ?? '', variables, missing)
  const scope = renderValue(auth.scope ?? '', variables, missing)
  if (tokenUrl.length === 0) throw new StudioError('OAuth2 tokenUrl 不能为空', 400)
  const cacheKey = `${tokenUrl}\n${clientId}\n${scope}`
  const cached = oauthTokenCache.get(cacheKey)
  let token = cached && cached.expiresAt > Date.now() ? cached.token : ''
  if (token.length === 0) {
    const form = new URLSearchParams()
    form.set('grant_type', 'client_credentials')
    if (scope.length > 0) form.set('scope', scope)
    const headers = { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' }
    if (auth.clientAuth === 'basic') {
      headers.authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    } else {
      form.set('client_id', clientId)
      form.set('client_secret', clientSecret)
    }
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(new Error('OAuth2 token 请求超时')), 15000)
    timer.unref?.()
    let payload
    try {
      const response = await fetch(tokenUrl, { method: 'POST', headers, body: form.toString(), signal: controller.signal })
      const text = await response.text()
      if (!response.ok) throw new Error(`OAuth2 token 请求失败：HTTP ${response.status} ${text.slice(0, 200)}`)
      try {
        payload = JSON.parse(text)
      } catch {
        const parsed = new URLSearchParams(text)
        payload = Object.fromEntries(parsed.entries())
      }
    } finally {
      clearTimeout(timer)
    }
    token = String(payload.access_token ?? payload.accessToken ?? '')
    if (token.length === 0) throw new StudioError('OAuth2 token 响应缺少 access_token', 502)
    const expiresIn = Number(payload.expires_in ?? payload.expiresIn ?? 3600)
    oauthTokenCache.set(cacheKey, { token, expiresAt: Date.now() + Math.max(30, expiresIn - 30) * 1000 })
  }
  const headers = [...request.headers, { key: 'authorization', value: `Bearer ${token}`, enabled: true }]
  return { ...request, headers, auth: { ...auth, type: 'none' } }
}

function digestHash(algorithm, value) {
  const name = String(algorithm || 'MD5').toUpperCase().replace(/-SESS$/, '')
  return createHash(name === 'SHA-256' ? 'sha256' : name === 'SHA-512-256' ? 'sha512-256' : 'md5').update(value).digest('hex')
}

function parseDigestChallenge(value) {
  const text = String(value ?? '')
  if (!/^digest\s/i.test(text)) return undefined
  const result = {}
  const pattern = /([a-zA-Z0-9_-]+)\s*=\s*(?:"([^"]*)"|([^,\s]+))/g
  let match
  while ((match = pattern.exec(text)) !== null) result[match[1].toLowerCase()] = match[2] ?? match[3]
  return result
}

async function executeDigest(prepared, auth, variables) {
  const first = await executePrepared(prepared)
  if (first.status !== 401) return first
  const challenge = parseDigestChallenge(first.headers['www-authenticate'] ?? first.headers['WWW-Authenticate'])
  if (!challenge || !challenge.realm || !challenge.nonce) return first
  const username = renderValue(auth.username ?? '', variables, [])
  const password = renderValue(auth.password ?? '', variables, [])
  const algorithm = challenge.algorithm || 'MD5'
  const uri = new URL(prepared.url).pathname + new URL(prepared.url).search
  const qopOptions = String(challenge.qop ?? '').split(',').map((entry) => entry.trim()).filter(Boolean)
  const qop = qopOptions.includes('auth') ? 'auth' : ''
  const cnonce = randomUUID().replace(/-/g, '').slice(0, 16)
  const nc = '00000001'
  let ha1 = digestHash(algorithm, `${username}:${challenge.realm}:${password}`)
  if (/-sess$/i.test(algorithm)) ha1 = digestHash(algorithm, `${ha1}:${challenge.nonce}:${cnonce}`)
  const ha2 = digestHash(algorithm, `${prepared.method}:${uri}`)
  const response = digestHash(algorithm, qop
    ? `${ha1}:${challenge.nonce}:${nc}:${cnonce}:${qop}:${ha2}`
    : `${ha1}:${challenge.nonce}:${ha2}`)
  const fields = [
    `username="${username.replace(/"/g, '\\"')}"`,
    `realm="${String(challenge.realm).replace(/"/g, '\\"')}"`,
    `nonce="${String(challenge.nonce).replace(/"/g, '\\"')}"`,
    `uri="${uri}"`,
    `response="${response}"`,
    `algorithm=${algorithm}`,
  ]
  if (qop) fields.push(`qop=${qop}`, `nc=${nc}`, `cnonce="${cnonce}"`)
  if (challenge.opaque) fields.push(`opaque="${String(challenge.opaque).replace(/"/g, '\\"')}"`)
  const headers = { ...prepared.headers, authorization: `Digest ${fields.join(', ')}` }
  prepared.headers = headers
  return executePrepared(prepared)
}

async function performRequest(request, variables, workspace) {
  const runtimeVariables = { ...variables }
  let hook = { variables: runtimeVariables, tests: [], error: '' }
  if (request.preScript && request.preScript.trim().length > 0) {
    try {
      hook = runHookScript(request.preScript, runtimeVariables, undefined)
    } catch (error) {
      throw new StudioError(`前置脚本失败：${messageOf(error)}`, 400)
    }
  }
  const oauthRequest = request.auth?.type === 'oauth1' ? applyOAuth1(request, hook.variables) : request.auth?.type === 'hawk' ? applyHawk(request, hook.variables) : request.auth?.type === 'aws' ? applyAwsSignature(request, hook.variables) : await applyOAuth(request, hook.variables)
  const prepared = prepareRequest(oauthRequest, hook.variables, workspace)
  const started = performance.now()
  let response
  try {
    response = request.auth?.type === 'digest' ? await executeDigest(prepared, request.auth, hook.variables) : await executePrepared(prepared)
  } catch (error) {
    const durationMs = Math.round(performance.now() - started)
    const failed = {
      status: 0,
      statusText: '',
      ok: false,
      durationMs,
      url: prepared.url,
      method: prepared.method,
      requestHeaders: prepared.headers,
      requestBody: bodyLabel(prepared.body),
      headers: {},
      cookies: [],
      body: '',
      json: undefined,
      size: 0,
      truncated: false,
      error: messageOf(error),
    }
    const tests = [...evaluateTests(request.tests, failed, hook.variables), ...hook.tests.map((entry) => ({ ...entry, type: 'script' }))]
    return {
      passed: false,
      request: requestSnapshot(request, prepared),
      response: failed,
      tests,
      warnings: prepared.warnings,
      error: failed.error,
      variables: hook.variables,
    }
  }
  let postHook = { variables: hook.variables, tests: [], error: '' }
  if (request.postScript && request.postScript.trim().length > 0) {
    try {
      postHook = runHookScript(request.postScript, hook.variables, response)
    } catch (error) {
      postHook.tests.push({ index: 0, name: '后置脚本', type: 'script', passed: false, actual: undefined, expected: true, message: messageOf(error) })
    }
  }
  const tests = [
    ...evaluateTests(request.tests, response, postHook.variables),
    ...hook.tests.map((entry) => ({ ...entry, type: 'script' })),
    ...postHook.tests.map((entry) => ({ ...entry, type: 'script' })),
  ]
  const passed = response.error === undefined && tests.every((test) => test.passed !== false)
  return {
    passed,
    request: requestSnapshot(request, prepared),
    response,
    tests,
    warnings: [...prepared.warnings, ...(response.warnings ?? [])],
    error: response.error,
    variables: postHook.variables,
  }
}

function runHookScript(code, variables, response) {
  const store = { ...variables }
  const tests = []
  const set = (key, value) => {
    const name = String(key ?? '').trim()
    if (name.length > 0 && value !== undefined && value !== null) store[name] = String(value)
  }
  const unset = (key) => { delete store[String(key ?? '').trim()] }
  const get = (key) => store[String(key ?? '').trim()]
  const pm = {
    variables: { get, set, unset, replaceIn: (value) => String(value ?? '') },
    environment: { get, set, unset },
    vars: { get, set, unset },
    test(name, assertion) {
      try {
        const value = typeof assertion === 'function' ? assertion() : assertion
        tests.push({ index: tests.length, name: String(name ?? '脚本断言'), type: 'script', passed: value !== false, actual: value, expected: true, message: value === false ? '脚本断言失败' : '脚本断言通过' })
      } catch (error) {
        tests.push({ index: tests.length, name: String(name ?? '脚本断言'), type: 'script', passed: false, actual: undefined, expected: true, message: messageOf(error) })
      }
    },
    response: response === undefined
      ? undefined
      : {
          code: response.status,
          status: response.status,
          headers: response.headers,
          responseTime: response.durationMs,
          json: () => response.json,
          text: () => response.body,
        },
    expect(value) {
      return {
        to: { be: { true: value === true, false: value === false } },
        toBe: (expected) => { if (value !== expected) throw new Error(`期望 ${formatValue(expected)}，实际 ${formatValue(value)}`) },
        toEqual: (expected) => { if (JSON.stringify(value) !== JSON.stringify(expected)) throw new Error(`期望 ${formatValue(expected)}，实际 ${formatValue(value)}`) },
      }
    },
  }
  const sandbox = {
    variables: store,
    vars: store,
    pm,
    response: response === undefined ? undefined : { status: response.status, statusText: response.statusText, headers: response.headers, body: response.body, json: response.json, durationMs: response.durationMs, url: response.url, ok: response.ok },
    console: { log() {}, error() {}, warn() {} },
  }
  vm.runInNewContext(`(function(){${code}\n})()`, sandbox, { timeout: 2000, displayErrors: true })
  return { variables: store, tests, error: '' }
}

function requestSnapshot(request, prepared) {
  return {
    id: request.id,
    name: request.name,
    method: prepared.method,
    url: prepared.url,
    headers: prepared.headers,
    body: bodyLabel(prepared.body),
    timeoutMs: prepared.timeoutMs,
    followRedirects: prepared.followRedirects,
    tests: request.tests,
  }
}

function bodyLabel(body) {
  if (typeof FormData !== 'undefined' && body instanceof FormData) return '[multipart/form-data]'
  return body ?? ''
}

async function executePrepared(prepared) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(new Error(`请求超过 ${prepared.timeoutMs}ms`)), prepared.timeoutMs)
  timer.unref?.()
  const started = performance.now()
  try {
    const response = await fetch(prepared.url, {
      method: prepared.method,
      headers: prepared.headers,
      body: prepared.body,
      redirect: prepared.followRedirects ? 'follow' : 'manual',
      signal: controller.signal,
    })
    const durationMs = Math.round(performance.now() - started)
    const body = await readResponseBody(response, MAX_RESPONSE_BYTES)
    const headers = headersToObject(response.headers)
    const contentType = headers['content-type'] ?? ''
    let json
    let jsonError
    const text = body.text
    if (/(^|\/|\+)json\b/i.test(contentType) || looksLikeJson(text)) {
      try {
        json = text.trim().length === 0 ? undefined : JSON.parse(text)
      } catch (error) {
        jsonError = messageOf(error)
      }
    }
    return {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      durationMs,
      url: response.url || prepared.url,
      method: prepared.method,
      requestHeaders: prepared.headers,
      requestBody: bodyLabel(prepared.body),
      headers,
      cookies: parseSetCookies(response.headers),
      body: body.text,
      json,
      jsonError,
      size: body.bytes,
      truncated: body.truncated,
      contentType,
      warnings: body.truncated ? ['响应体超过上限，已截断以便保存和展示'] : [],
    }
  } catch (error) {
    const message = controller.signal.aborted ? messageOf(controller.signal.reason) : messageOf(error)
    throw new Error(message)
  } finally {
    clearTimeout(timer)
  }
}

async function readResponseBody(response, maxBytes) {
  if (response.body === null || response.body === undefined) {
    return { text: '', bytes: 0, truncated: false }
  }
  const reader = response.body.getReader()
  const chunks = []
  let total = 0
  let truncated = false
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = Buffer.from(value)
      if (total + chunk.length > maxBytes) {
        const remaining = Math.max(0, maxBytes - total)
        if (remaining > 0) chunks.push(chunk.subarray(0, remaining))
        total += remaining
        truncated = true
        await reader.cancel().catch(() => {})
        break
      }
      chunks.push(chunk)
      total += chunk.length
    }
  } finally {
    reader.releaseLock()
  }
  const buffer = Buffer.concat(chunks)
  return { text: buffer.toString('utf8'), bytes: total, truncated }
}

function prepareRequest(request, variables, workspace) {
  const missing = []
  const method = METHODS.has(String(request.method).toUpperCase()) ? String(request.method).toUpperCase() : 'GET'
  const renderedUrl = renderValue(String(request.url ?? ''), variables, missing)
  if (/\{\{[^{}]+\}\}/.test(renderedUrl)) {
    const names = [...new Set([...renderedUrl.matchAll(/\{\{\s*([^{}]+?)\s*\}\}/g)].map((match) => match[1]))]
    throw new StudioError(`URL 中仍有未定义变量：${names.join('、')}`, 400)
  }
  let url
  try {
    url = new URL(renderedUrl)
  } catch {
    throw new StudioError(`URL 无效：${renderedUrl}`, 400)
  }
  if (!/^https?:$/.test(url.protocol)) throw new StudioError('只支持 http/https URL', 400)

  const headers = {}
  for (const entry of workspace?.globalHeaders ?? []) {
    if (entry.enabled === false || entry.key.trim().length === 0) continue
    setHeader(headers, entry.key, renderValue(entry.value, variables, missing))
  }
  for (const entry of workspace?.globalQuery ?? []) {
    if (entry.enabled === false || entry.key.trim().length === 0) continue
    url.searchParams.append(entry.key, renderValue(entry.value, variables, missing))
  }
  for (const entry of request.headers) {
    if (entry.enabled === false || entry.key.trim().length === 0) continue
    const value = renderValue(entry.value, variables, missing)
    setHeader(headers, entry.key, value)
  }
  for (const entry of request.query) {
    if (entry.enabled === false || entry.key.trim().length === 0) continue
    url.searchParams.append(entry.key, renderValue(entry.value, variables, missing))
  }
  const cookiePairs = (request.cookies ?? [])
    .filter((entry) => entry.enabled !== false && entry.key.trim().length > 0)
    .map((entry) => `${entry.key}=${renderValue(entry.value, variables, missing)}`)
  if (cookiePairs.length > 0) {
    const existingCookie = headers.cookie
    headers.cookie = existingCookie ? `${existingCookie}; ${cookiePairs.join('; ')}` : cookiePairs.join('; ')
  }

  const auth = request.auth ?? { type: 'none' }
  if (auth.type === 'bearer' && auth.token) {
    setHeader(headers, 'authorization', `Bearer ${renderValue(auth.token, variables, missing)}`)
  } else if (auth.type === 'basic' && (auth.username || auth.password)) {
    const username = renderValue(auth.username ?? '', variables, missing)
    const password = renderValue(auth.password ?? '', variables, missing)
    setHeader(headers, 'authorization', `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`)
  } else if (auth.type === 'apiKey' && auth.key) {
    const value = renderValue(auth.value ?? '', variables, missing)
    if (auth.in === 'query') url.searchParams.append(auth.key, value)
    else setHeader(headers, auth.key, value)
  }

  let body
  const hasFields = (request.body.fields ?? []).some((entry) => entry.enabled !== false && entry.key.trim().length > 0)
  if (method !== 'GET' && method !== 'HEAD' && request.body.type !== 'none' && (request.body.text.length > 0 || hasFields)) {
    if (request.body.type === 'multipart') {
      const form = new FormData()
      for (const entry of request.body.fields ?? []) {
        if (entry.enabled === false || entry.key.trim().length === 0) continue
        const key = renderValue(entry.key, variables, missing)
        if (entry.type === 'file' && entry.data.length > 0) {
          const bytes = Buffer.from(entry.data, 'base64')
          if (bytes.length > MAX_UPLOAD_BYTES) throw new StudioError(`文件 "${entry.filename || key}" 超过 5MB 限制`, 400)
          form.append(key, new Blob([bytes], { type: entry.contentType || 'application/octet-stream' }), entry.filename || key)
        } else {
          form.append(key, renderValue(entry.value, variables, missing))
        }
      }
      body = form
    } else if (request.body.type === 'json') {
      body = renderValue(request.body.text, variables, missing)
      if (!hasHeader(headers, 'content-type')) setHeader(headers, 'content-type', 'application/json')
    } else if (request.body.type === 'form') {
      const fields = Array.isArray(request.body.fields) ? request.body.fields.filter((entry) => entry.enabled !== false && entry.key.trim().length > 0) : []
      if (fields.length > 0) {
        const form = new URLSearchParams()
        for (const entry of fields) form.append(renderValue(entry.key, variables, missing), renderValue(entry.value, variables, missing))
        body = form.toString()
      } else {
        body = renderValue(request.body.text, variables, missing)
      }
      if (!hasHeader(headers, 'content-type')) setHeader(headers, 'content-type', 'application/x-www-form-urlencoded')
    } else {
      body = renderValue(request.body.text, variables, missing)
      if (!hasHeader(headers, 'content-type')) setHeader(headers, 'content-type', 'text/plain; charset=utf-8')
    }
  }

  return {
    method,
    url: url.toString(),
    headers,
    body,
    timeoutMs: request.timeoutMs,
    followRedirects: request.followRedirects,
    warnings: [...new Set(missing)].map((name) => `变量 ${name} 未定义，已保留占位符`),
  }
}

/* ------------------------------------------------------------------ */
/* Flows                                                               */
/* ------------------------------------------------------------------ */

async function runFlowAction(ctx, params) {
  let flow
  if (isPlainObject(params.flow)) flow = normalizeFlow(params.flow, undefined, typeof params.flow.id === 'string' ? params.flow.id : newId('flow'))
  else if (typeof params.flowId === 'string') {
    flow = await readFlow(ctx, params.flowId)
    if (flow === undefined) throw new StudioError(`流程 "${params.flowId}" 不存在`, 404)
  } else throw new StudioError('run_flow 需要 flow 或 flowId', 400)
  const extraVariables = isPlainObject(params.variables) ? normalizeVariables(params.variables) : {}
  return executeFlow(ctx, flow, extraVariables, undefined, params.environmentId)
}

async function runFlowDatasetAction(ctx, params) {
  let flow
  if (isPlainObject(params.flow)) flow = normalizeFlow(params.flow, undefined, typeof params.flow.id === 'string' ? params.flow.id : newId('flow'))
  else if (typeof params.flowId === 'string') {
    flow = await readFlow(ctx, params.flowId)
    if (flow === undefined) throw new StudioError(`流程 "${params.flowId}" 不存在`, 404)
  } else throw new StudioError('run_flow_dataset 需要 flow 或 flowId', 400)
  if (!Array.isArray(flow.dataset) || flow.dataset.length === 0) throw new StudioError('流程没有数据集', 400)
  const runs = []
  for (let index = 0; index < flow.dataset.length; index += 1) {
    const row = flow.dataset[index]
    runs.push(await executeFlow(ctx, flow, row, `${flow.name} · 数据 ${index + 1}`, params.environmentId))
  }
  return {
    count: runs.length,
    passed: runs.filter((run) => run.passed).length,
    failed: runs.filter((run) => !run.passed).length,
    runs: runs.map((run) => ({ id: run.id, kind: run.kind, title: run.title, passed: run.passed, error: run.error, summary: run.summary })),
  }
}

async function executeFlow(ctx, flow, extraVariables, runTitle, environmentId) {
  const store = await ensureStore(ctx)
  const workspace = await readWorkspace(store)
  const environment = typeof environmentId === 'string' ? workspace.environments.find((entry) => entry.id === environmentId) : undefined
  const id = newId('run')
  const baseVariables = environment ? { ...workspace.variables, ...environment.variables } : activeEnvironmentVariables(workspace)
  const variables = runtimeVariables(baseVariables, { ...normalizeVariables(flow.variables), ...extraVariables }, id)
  const started = performance.now()
  const steps = []
  let stopped = false

  for (const step of flow.steps) {
    const stepStarted = performance.now()
    if (step.delayMs > 0) await delay(step.delayMs)
    if (step.condition.length > 0 && !evaluateCondition(step.condition, variables)) {
      steps.push({
        stepId: step.id,
        stepName: step.name,
        requestId: step.requestId,
        skipped: true,
        passed: true,
        request: null,
        response: { status: 0, error: '条件不满足，跳过' },
        tests: [],
        extracted: {},
        extractErrors: [],
        durationMs: Math.round(performance.now() - stepStarted),
      })
      continue
    }
    const request = await readRequest(ctx, step.requestId)
    if (request === undefined) {
      steps.push({
        stepId: step.id,
        stepName: step.name,
        requestId: step.requestId,
        passed: false,
        request: null,
        response: { status: 0, error: `接口 "${step.requestId}" 不存在` },
        tests: [],
        extracted: {},
        extractErrors: [`接口 "${step.requestId}" 不存在`],
        durationMs: Math.round(performance.now() - stepStarted),
      })
      if (flow.stopOnFailure !== false && !step.continueOnFailure) {
        stopped = true
        break
      }
      continue
    }

    const effective = applyOverrides(request, step.overrides)
    const outcome = await performRequest(effective, variables, workspace)
    if (isPlainObject(outcome.variables)) Object.assign(variables, outcome.variables)
    const extracted = {}
    const extractErrors = extractVariables(step.extract, outcome.response, variables, extracted)
    const passed = outcome.passed && extractErrors.length === 0
    steps.push({
      stepId: step.id,
      stepName: step.name,
      requestId: step.requestId,
      requestName: request.name,
      passed,
      ...outcome,
      extracted,
      extractErrors,
      durationMs: Math.round(performance.now() - stepStarted),
    })
    if (!passed && flow.stopOnFailure !== false && !step.continueOnFailure) {
      stopped = true
      break
    }
  }

  const complete = steps.length === flow.steps.length
  const passed = complete && steps.every((step) => step.passed)
  const run = {
    id,
    kind: 'flow',
    title: runTitle || flow.name,
    flowId: flow.id,
    flowName: flow.name,
    createdAt: nowIso(),
    durationMs: Math.round(performance.now() - started),
    passed,
    complete,
    stopped,
    steps,
    variables,
  }
  run.summary = summarizeRun(run).summary
  await persistRun(store, run)
  return run
}

function applyOverrides(request, overrides) {
  if (!isPlainObject(overrides) || Object.keys(overrides).length === 0) return request
  return normalizeRequest({ ...request, ...overrides }, request, request.id)
}

function extractVariables(rules, response, variables, extracted) {
  const errors = []
  for (const rule of rules) {
    if (typeof rule.name !== 'string' || rule.name.length === 0) continue
    let value
    try {
      if (rule.from === 'header') {
        const name = String(rule.path || rule.name).toLowerCase()
        value = response.headers?.[name]
      } else if (rule.from === 'status') {
        value = response.status
      } else if (rule.from === 'regex') {
        const source = String(rule.path || rule.regex || '')
        const match = source.length > 0 ? new RegExp(source).exec(response.body ?? '') : null
        value = match === null ? undefined : match[Number(rule.group ?? 1)] ?? match[0]
      } else {
        value = getByPath(response.json, rule.path)
      }
    } catch (error) {
      errors.push(`提取 ${rule.name} 失败：${messageOf(error)}`)
      continue
    }
    if (value === undefined || value === null) {
      errors.push(`提取 ${rule.name} 失败：路径 ${rule.path ?? ''} 没有值`)
      continue
    }
    const stored = typeof value === 'object' ? JSON.stringify(value) : String(value)
    variables[rule.name] = stored
    extracted[rule.name] = stored
  }
  return errors
}

/* ------------------------------------------------------------------ */
/* Assertions                                                          */
/* ------------------------------------------------------------------ */

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function evaluateCondition(expression, variables) {
  try {
    const sandbox = { variables: { ...variables }, vars: { ...variables }, console: { log() {}, error() {}, warn() {} } }
    return Boolean(vm.runInNewContext(String(expression), sandbox, { timeout: 1000, displayErrors: true }))
  } catch {
    return false
  }
}

function evaluateTests(tests, response, variables) {
  const results = []
  for (let index = 0; index < tests.length; index += 1) {
    const test = tests[index]
    if (test.enabled === false) continue
    results.push(evaluateTest(test, index, response, variables))
  }
  return results
}

function evaluateTest(test, index, response, variables) {
  const type = String(test.type ?? 'status').toLowerCase()
  const name = test.name || defaultTestName(test)
  const expected = renderValue(test.value ?? test.expected ?? '', variables, [])
  try {
    if (type === 'schema') {
      const schema = isPlainObject(test.schema) ? test.schema : undefined
      if (schema === undefined) throw new Error('schema 断言缺少 JSON Schema')
      const errors = validateJsonSchema(response.json, schema, '$')
      return {
        index,
        name,
        type,
        passed: errors.length === 0,
        actual: errors.length === 0 ? 'schema valid' : errors.join('; '),
        expected: 'schema valid',
        message: errors.length === 0 ? '通过：Schema 校验成功' : `失败：${errors.join('; ')}`,
      }
    }
    if (type === 'script') {
      const outcome = runScript(test.code ?? '', response, variables)
      return {
        index,
        name,
        type,
        passed: outcome.passed,
        actual: outcome.actual,
        expected: outcome.expected,
        message: outcome.message,
      }
    }
    const operator = String(test.op ?? test.operator ?? defaultOperator(type)).toLowerCase()
    let actual
    if (type === 'status') actual = response.status
    else if (type === 'json') actual = getByPath(response.json, test.path ?? test.jsonPath ?? '')
    else if (type === 'body') actual = response.body ?? ''
    else if (type === 'header') actual = response.headers?.[String(test.header ?? test.path ?? '').toLowerCase()]
    else if (type === 'latency' || type === 'responseTime') actual = response.durationMs
    else if (type === 'size') actual = response.size
    else throw new Error(`不支持的断言类型 "${type}"`)
    const passed = compare(actual, operator, expected)
    return {
      index,
      name,
      type,
      passed,
      actual,
      expected,
      message: passed
        ? `通过：${operator} ${formatValue(expected)}`
        : `失败：期望 ${operator} ${formatValue(expected)}，实际 ${formatValue(actual)}`,
    }
  } catch (error) {
    return {
      index,
      name,
      type,
      passed: false,
      actual: undefined,
      expected,
      message: messageOf(error),
    }
  }
}

function defaultOperator(type) {
  if (type === 'json' || type === 'status' || type === 'header' || type === 'size') return 'eq'
  if (type === 'latency' || type === 'responseTime') return 'lt'
  return 'contains'
}

function defaultTestName(test) {
  const type = String(test.type ?? 'status').toLowerCase()
  if (type === 'status') return `状态码 ${test.op ?? 'eq'} ${test.value ?? ''}`
  if (type === 'json') return `JSON ${test.path ?? ''} ${test.op ?? 'eq'} ${formatValue(test.value ?? '')}`
  if (type === 'header') return `响应头 ${test.header ?? ''} ${test.op ?? 'eq'} ${formatValue(test.value ?? '')}`
  if (type === 'latency') return `响应时间 ${test.op ?? 'lt'} ${test.value ?? ''}ms`
  if (type === 'body') return `响应体 ${test.op ?? 'contains'} ${formatValue(test.value ?? '')}`
  if (type === 'script') return '自定义脚本'
  if (type === 'schema') return 'JSON Schema 校验'
  return type
}

function validateJsonSchema(value, schema, path) {
  const errors = []
  if (!isPlainObject(schema)) return [`${path}: schema 不是对象`]
  const type = schema.type
  if (type !== undefined) {
    const actual = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value
    const expectedTypes = Array.isArray(type) ? type : [type]
    const matches = expectedTypes.some((entry) => entry === actual || (entry === 'integer' && typeof value === 'number' && Number.isInteger(value)) || (entry === 'number' && typeof value === 'number'))
    if (!matches) errors.push(`${path}: 期望 ${expectedTypes.join('|')}，实际 ${actual}`)
  }
  if (Array.isArray(schema.enum) && !schema.enum.some((entry) => JSON.stringify(entry) === JSON.stringify(value))) {
    errors.push(`${path}: 不在 enum 中`)
  }
  if (isPlainObject(value) && isPlainObject(schema.properties)) {
    for (const key of schema.required ?? []) {
      if (!(key in value)) errors.push(`${path}.${key}: 缺少必填字段`)
    }
    for (const [key, childSchema] of Object.entries(schema.properties)) {
      if (key in value) errors.push(...validateJsonSchema(value[key], childSchema, `${path}.${key}`))
    }
  }
  if (Array.isArray(value) && isPlainObject(schema.items)) {
    value.forEach((entry, index) => errors.push(...validateJsonSchema(entry, schema.items, `${path}[${index}]`)))
  }
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${path}: 长度小于 ${schema.minLength}`)
    if (schema.maxLength !== undefined && value.length > schema.maxLength) errors.push(`${path}: 长度大于 ${schema.maxLength}`)
  }
  return errors
}

function compare(actual, operator, expected) {
  const op = String(operator).toLowerCase()
  switch (op) {
    case 'eq':
    case 'equals':
    case '==':
      return equals(actual, expected)
    case 'ne':
    case '!=':
      return !equals(actual, expected)
    case 'exists':
      return actual !== undefined && actual !== null
    case 'notexists':
    case 'absent':
      return actual === undefined || actual === null
    case 'truthy':
      return Boolean(actual)
    case 'falsy':
      return !actual
    case 'contains':
    case 'includes':
      return String(actual ?? '').includes(String(expected ?? ''))
    case 'notcontains':
      return !String(actual ?? '').includes(String(expected ?? ''))
    case 'regex':
    case 'matches':
      return new RegExp(String(expected)).test(String(actual ?? ''))
    case 'gt':
    case '>':
      return Number(actual) > Number(expected)
    case 'gte':
    case '>=':
      return Number(actual) >= Number(expected)
    case 'lt':
    case '<':
      return Number(actual) < Number(expected)
    case 'lte':
    case '<=':
      return Number(actual) <= Number(expected)
    case 'in': {
      const values = Array.isArray(expected) ? expected : String(expected).split(',').map((value) => value.trim())
      return values.some((value) => equals(actual, value))
    }
    case 'type':
      return typeOf(actual) === String(expected)
    case 'length':
      return Number(actual?.length) === Number(expected)
    default:
      throw new Error(`不支持的比较操作 "${operator}"`)
  }
}

function equals(actual, expected) {
  if (actual === expected) return true
  if (actual === undefined || actual === null || expected === undefined || expected === null) return false
  if (typeof actual === 'number' && typeof expected === 'string' && expected.trim() !== '' && !Number.isNaN(Number(expected))) {
    return actual === Number(expected)
  }
  if (typeof actual === 'boolean' && typeof expected === 'string') return String(actual) === expected
  if (typeof actual === 'object' || typeof expected === 'object') {
    try {
      return JSON.stringify(actual) === JSON.stringify(expected)
    } catch {
      return false
    }
  }
  return String(actual) === String(expected)
}

function typeOf(value) {
  if (Array.isArray(value)) return 'array'
  if (value === null) return 'null'
  return typeof value
}

function runScript(code, response, variables) {
  if (typeof code !== 'string' || code.trim().length === 0) throw new Error('脚本为空')
  const sandbox = {
    response: {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body: response.body,
      json: response.json,
      durationMs: response.durationMs,
      url: response.url,
      ok: response.ok,
    },
    status: response.status,
    headers: response.headers,
    body: response.body,
    json: response.json,
    vars: { ...variables },
    variables: { ...variables },
    console: { log() {}, error() {}, warn() {} },
  }
  const source = /\breturn\b/.test(code)
    ? `(function(){${code}\n})()`
    : `(function(){return (${code});})()`
  const value = vm.runInNewContext(source, sandbox, { timeout: 1000, displayErrors: true })
  if (isPlainObject(value) && typeof value.passed === 'boolean') {
    return {
      passed: value.passed,
      actual: value.actual,
      expected: value.expected,
      message: value.message ?? (value.passed ? '脚本通过' : '脚本失败'),
    }
  }
  return {
    passed: Boolean(value),
    actual: value,
    expected: true,
    message: value ? '脚本通过' : `脚本返回 ${formatValue(value)}`,
  }
}

/* ------------------------------------------------------------------ */
/* Runs and reports                                                    */
/* ------------------------------------------------------------------ */

async function persistRun(store, run) {
  run.response = trimResponse(run.response)
  if (Array.isArray(run.steps)) {
    for (const step of run.steps) step.response = trimResponse(step.response)
  }
  const entry = summarizeRun(run)
  run.summary = entry.summary
  await writeJsonAtomic(join(store.runs, `${run.id}.json`), run)
  const index = await readJson(store.runIndex, [])
  const entries = Array.isArray(index) ? index : []
  entries.unshift(entry)
  const kept = entries.slice(0, MAX_RUNS)
  await writeJsonAtomic(store.runIndex, kept)
  await pruneRunFiles(store, new Set(kept.map((entry) => entry.id)))
}

async function listRuns(ctx) {
  const store = await ensureStore(ctx)
  const index = await readJson(store.runIndex, [])
  if (Array.isArray(index) && index.length > 0) return index
  const files = await listJsonFiles(store.runs)
  const entries = []
  for (const file of files) {
    if (file.endsWith('index.json')) continue
    const run = await readJson(file, undefined)
    if (!isPlainObject(run) || typeof run.id !== 'string') continue
    entries.push(summarizeRun(run))
  }
  entries.sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt)))
  const kept = entries.slice(0, MAX_RUNS)
  await writeJsonAtomic(store.runIndex, kept)
  return kept
}

async function getRun(ctx, id) {
  const store = await ensureStore(ctx)
  const run = await readJson(safeFile(store.runs, id, 'json'), undefined)
  if (!isPlainObject(run)) throw new StudioError(`运行记录 "${id}" 不存在`, 404)
  return run
}

function summarizeRun(run) {
  const steps = Array.isArray(run.steps) ? run.steps : []
  const tests = steps.length > 0 ? steps.flatMap((step) => step.tests ?? []) : run.tests ?? []
  const testPassed = tests.filter((test) => test.passed).length
  const latencies = (steps.length > 0 ? steps.map((step) => step.response?.durationMs ?? 0) : [run.response?.durationMs ?? 0]).filter((value) => Number.isFinite(value))
  return {
    id: run.id,
    kind: run.kind,
    title: run.title ?? run.requestName ?? run.flowName ?? '未命名运行',
    requestId: run.requestId,
    requestName: run.requestName,
    flowId: run.flowId,
    flowName: run.flowName,
    passed: run.passed === true,
    createdAt: run.createdAt,
    durationMs: run.durationMs ?? run.response?.durationMs ?? 0,
    summary: {
      executed: steps.length > 0 ? steps.length : 1,
      passed: steps.length > 0 ? steps.filter((step) => step.passed).length : run.passed ? 1 : 0,
      failed: steps.length > 0 ? steps.filter((step) => !step.passed).length : run.passed ? 0 : 1,
      tests: { total: tests.length, passed: testPassed, failed: tests.length - testPassed },
      status: steps.length === 0 ? run.response?.status : undefined,
      avgLatencyMs: latencies.length === 0 ? 0 : Math.round(latencies.reduce((sum, value) => sum + value, 0) / latencies.length),
      maxLatencyMs: latencies.length === 0 ? 0 : Math.max(...latencies),
    },
  }
}

function trimResponse(response) {
  if (!isPlainObject(response)) return response
  const next = { ...response }
  if (typeof next.body === 'string' && Buffer.byteLength(next.body) > MAX_STORED_BODY_BYTES) {
    next.body = Buffer.from(next.body).subarray(0, MAX_STORED_BODY_BYTES).toString('utf8')
    next.truncated = true
    next.json = undefined
  }
  return next
}

async function pruneRunFiles(store, keep) {
  const files = await listJsonFiles(store.runs)
  for (const file of files) {
    const name = file.slice(file.lastIndexOf(sep) + 1)
    if (name === 'index.json') continue
    const id = name.replace(/\.json$/, '')
    if (!keep.has(id)) await rm(file, { force: true })
  }
}

async function listReports(ctx) {
  const store = await ensureStore(ctx)
  const index = await readJson(store.reportIndex, [])
  return Array.isArray(index) ? index : []
}

async function readReport(ctx, id) {
  const store = await ensureStore(ctx)
  const file = safeFile(store.reports, id, 'md')
  const content = await readFile(file, 'utf8').catch(() => undefined)
  if (content === undefined) throw new StudioError(`报告 "${id}" 不存在`, 404)
  return { id, content }
}

async function deleteReport(ctx, id) {
  const store = await ensureStore(ctx)
  const file = safeFile(store.reports, id, 'md')
  if (!(await exists(file))) throw new StudioError(`报告 "${id}" 不存在`, 404)
  await rm(file, { force: true })
  const index = await listReports(ctx)
  await writeJsonAtomic(store.reportIndex, index.filter((entry) => entry.id !== id))
  return { deleted: true, id }
}

async function persistReport(store, report) {
  await writeFile(safeFile(store.reports, report.id, 'md'), report.content, 'utf8')
  const index = await listReportsFromStore(store)
  index.unshift({
    id: report.id,
    title: report.title,
    runId: report.runId,
    createdAt: report.createdAt,
    provider: report.provider,
    model: report.model,
    ai: report.ai === true,
  })
  const kept = index.slice(0, MAX_REPORTS)
  await writeJsonAtomic(store.reportIndex, kept)
  const keep = new Set(kept.map((entry) => entry.id))
  for (const file of await listFiles(store.reports, '.md')) {
    const id = file.slice(file.lastIndexOf(sep) + 1).replace(/\.md$/, '')
    if (!keep.has(id)) await rm(file, { force: true })
  }
  return kept[0]
}

async function listReportsFromStore(store) {
  const index = await readJson(store.reportIndex, [])
  return Array.isArray(index) ? index : []
}

/* ------------------------------------------------------------------ */
/* AI                                                                  */
/* ------------------------------------------------------------------ */

function aiStatus(ctx) {
  try {
    const selection = resolveModelSelection(ctx)
    return { available: true, provider: selection.provider, model: selection.model, reason: '' }
  } catch (error) {
    return { available: false, provider: '', model: '', reason: messageOf(error) }
  }
}

function resolveModelSelection(ctx) {
  const envProvider = process.env.API_STUDIO_AI_PROVIDER?.trim()
  const envModel = process.env.API_STUDIO_AI_MODEL?.trim()
  if (envProvider && envModel) return { provider: envProvider, model: envModel }
  let selection
  try {
    selection = ctx.get('agentDefaultModel')?.currentSelection?.()
  } catch {
    selection = undefined
  }
  const provider = selection?.provider ?? selection?.providerId
  const model = selection?.model ?? selection?.modelId
  if (typeof provider === 'string' && provider.length > 0 && typeof model === 'string' && model.length > 0) {
    return { provider, model }
  }
  throw new StudioError('未找到默认 AI 模型，请先在设置中选择模型，或设置 API_STUDIO_AI_PROVIDER / API_STUDIO_AI_MODEL', 400)
}

async function aiCreate(ctx, params) {
  const prompt = typeof params.prompt === 'string' ? params.prompt.trim() : ''
  if (prompt.length === 0) throw new StudioError('prompt 不能为空', 400)
  const kind = ['request', 'flow', 'auto'].includes(params.kind) ? params.kind : 'auto'
  const store = await ensureStore(ctx)
  const requests = await listRequests(ctx)
  const existing = requests.map((request) => ({
    id: request.id,
    name: request.name,
    method: request.method,
    url: request.url,
    description: request.description,
  }))
  const selection = resolveModelSelection(ctx)
  const system = aiAuthorSystemPrompt()
  const user = [
    `创作目标类型：${kind}`,
    `用户需求：${prompt}`,
    `已有接口（流程步骤应优先复用这些 id）：${JSON.stringify(existing, null, 2)}`,
    '只返回一个 JSON 对象，不要 Markdown 代码围栏，不要解释文字。',
  ].join('\n\n')
  const text = await streamAiText(ctx, system, user, 6000)
  const parsed = extractJson(text)
  if (parsed === undefined) {
    return {
      kind,
      error: 'AI 没有返回可解析的 JSON，可重试或把需求写得更具体。',
      raw: text,
      provider: selection.provider,
      model: selection.model,
    }
  }

  try {
    const result = await persistAiResult(ctx, store, parsed, kind, requests)
    return {
      kind: result.kind,
      explanation: typeof parsed.explanation === 'string' ? parsed.explanation : '',
      created: result.created,
      provider: selection.provider,
      model: selection.model,
      raw: text,
    }
  } catch (error) {
    return {
      kind,
      error: messageOf(error),
      raw: text,
      provider: selection.provider,
      model: selection.model,
    }
  }
}

async function persistAiResult(ctx, store, parsed, requestedKind, existingRequests) {
  const requests = [...existingRequests]
  const createdRequests = []
  const pendingRequests = Array.isArray(parsed) ? parsed : Array.isArray(parsed.requests) ? parsed.requests : []
  for (const input of pendingRequests) {
    const saved = await saveRequestFromInput(ctx, input)
    createdRequests.push(saved)
    requests.push(saved)
  }

  const flowInput = isPlainObject(parsed.flow) ? parsed.flow : isPlainObject(parsed) && (parsed.kind === 'flow' || Array.isArray(parsed.steps)) ? parsed : undefined
  const requestInput = isPlainObject(parsed.request) ? parsed.request : isPlainObject(parsed) && parsed.kind === 'request' ? parsed : undefined

  if (flowInput !== undefined) {
    const flow = await persistAiFlow(ctx, flowInput, requests)
    return { kind: 'flow', created: { requests: createdRequests, flow } }
  }
  if (requestInput !== undefined) {
    const request = await saveRequestFromInput(ctx, requestInput)
    createdRequests.push(request)
    return { kind: 'request', created: { requests: createdRequests, flow: null } }
  }
  if (createdRequests.length > 0) {
    return { kind: 'requests', created: { requests: createdRequests, flow: null } }
  }
  throw new StudioError('AI 返回的 JSON 里没有 request、requests 或 flow', 400)
}

async function persistAiFlow(ctx, input, requests) {
  const normalized = normalizeFlow(input, undefined, typeof input.id === 'string' ? input.id : newId('flow'))
  const byId = new Map(requests.map((request) => [request.id, request]))
  const byName = new Map(requests.map((request) => [request.name, request]))
  for (const step of normalized.steps) {
    if (isPlainObject(step.request)) {
      const saved = await saveRequestFromInput(ctx, step.request)
      byId.set(saved.id, saved)
      byName.set(saved.name, saved)
      step.requestId = saved.id
    }
    const candidate = step.requestId || step.name
    let request = byId.get(candidate) ?? byName.get(candidate)
    if (request === undefined && typeof step.request === 'string') {
      request = byId.get(step.request) ?? byName.get(step.request)
    }
    if (request === undefined) {
      throw new StudioError(`AI 流程步骤 "${step.name}" 引用了不存在的接口 "${candidate}"；可用 id：${[...byId.keys()].join(', ')}`, 400)
    }
    step.requestId = request.id
  }
  return saveFlowFromInput(ctx, normalized)
}

function aiAuthorSystemPrompt() {
  return [
    '你是 AirPost 的接口测试架构师。你根据自然语言需求生成可执行的 HTTP 接口定义、测试断言和业务流程。',
    '你必须只返回一个 JSON 对象，不要 Markdown，不要解释 JSON 之外的内容。',
    '顶层结构二选一：',
    '1) {"kind":"request","explanation":"...","request":{...}}',
    '2) {"kind":"flow","explanation":"...","requests":[{...}],"flow":{...}}',
    '接口对象字段：name, description, folder, method, url, headers, query, body, auth, tests, timeoutMs, followRedirects。folder 是可选的集合分组名。',
    'headers/query 可以是 {"Key":"Value"} 对象。body 可以是 {"type":"json","text":"{\\n  \\"a\\": 1\\n}"}，也可以直接是字符串。',
    'auth 可以是 {"type":"none"}、{"type":"bearer","token":"{{token}}"}、{"type":"basic","username":"...","password":"..."} 或 {"type":"apiKey","key":"X-Key","value":"...","in":"header"}。',
    'tests 是断言数组。可用类型和字段：',
    '- {"type":"status","op":"eq","value":200}',
    '- {"type":"json","path":"data.items[0].id","op":"exists"} 或 {"type":"json","path":"code","op":"eq","value":0}',
    '- {"type":"body","op":"contains","value":"ok"}',
    '- {"type":"header","header":"content-type","op":"contains","value":"json"}',
    '- {"type":"latency","op":"lt","value":2000}',
    '- {"type":"script","code":"return response.status === 200 && json.ok === true"}',
    '比较操作支持 eq, ne, exists, contains, notcontains, regex, gt, gte, lt, lte, in, type。',
    'URL 和值支持 {{变量}}。工作区已有变量 baseUrl；也可使用 {{runId}}、{{uuid}}、{{timestamp}}。',
    '流程对象字段：name, description, folder, variables, stopOnFailure, steps。folder 是可选的集合分组名。',
    '步骤字段：name, requestId, overrides, extract, continueOnFailure。extract 形如 [{"name":"postId","from":"body","path":"data.id"}]；from 可为 body/header/status/regex。',
    '流程步骤应复用已有接口 id；如果需要新接口，把它们放进 requests 数组，并在步骤里用新接口的 name 或 id 引用。',
    'extract 提取出的变量值都是字符串；脚本里比较数字时请使用 Number(vars.userId) 或 ==，不要用 === 直接比较 number 与 string。',
    '测试要具体、可执行，不要写空断言。默认给关键请求加状态码断言和一个业务字段断言。',
    '用中文填写 name/description/explanation。',
  ].join('\n')
}

async function aiAnalyze(ctx, params) {
  const store = await ensureStore(ctx)
  let run
  if (typeof params.runId === 'string' && params.runId.length > 0) run = await getRun(ctx, params.runId)
  else {
    const runs = await listRuns(ctx)
    if (runs.length === 0) throw new StudioError('还没有运行记录，请先执行一次接口或流程', 400)
    run = await getRun(ctx, runs[0].id)
  }
  const extraPrompt = typeof params.prompt === 'string' ? params.prompt.trim() : ''
  const selection = aiStatus(ctx)
  let content = ''
  let aiError = ''
  if (selection.available) {
    try {
      const system = [
        '你是一名资深接口测试与质量分析师。',
        '根据给出的 AirPost 运行记录，用中文写一份 Markdown 测试报告。',
        '必须包含这些二级标题：## 结论、## 关键指标、## 失败定位、## 风险与回归建议、## 复现步骤。',
        '结论先给 PASS/FAIL 判断；失败定位要引用具体步骤、断言、状态码和响应片段；建议要可执行。',
        '不要编造记录里不存在的数据。不要用代码围栏包住整篇报告。',
      ].join('\n')
      const user = [
        `用户补充要求：${extraPrompt || '无'}`,
        '运行记录（响应体已截断）：',
        JSON.stringify(compactRunForAi(run), null, 2),
      ].join('\n\n')
      content = normalizeReportText(await streamAiText(ctx, system, user, 5000))
    } catch (error) {
      aiError = messageOf(error)
    }
  } else {
    aiError = selection.reason
  }
  if (content.trim().length === 0) content = fallbackReport(run, aiError)
  const report = {
    id: newId('report'),
    title: `${run.title ?? '测试'} · 分析报告`,
    runId: run.id,
    createdAt: nowIso(),
    provider: selection.provider,
    model: selection.model,
    ai: aiError.length === 0,
    aiError,
    content,
  }
  const entry = await persistReport(store, report)
  return { ...entry, content, reportId: report.id, aiError }
}

function compactRunForAi(run) {
  const base = {
    id: run.id,
    kind: run.kind,
    title: run.title,
    createdAt: run.createdAt,
    passed: run.passed,
    durationMs: run.durationMs,
    summary: run.summary,
    variables: run.variables,
  }
  if (Array.isArray(run.steps)) {
    return {
      ...base,
      steps: run.steps.map((step) => ({
        stepId: step.stepId,
        stepName: step.stepName,
        requestName: step.requestName,
        passed: step.passed,
        extracted: step.extracted,
        extractErrors: step.extractErrors,
        durationMs: step.durationMs,
        request: step.request,
        response: compactResponse(step.response),
        tests: step.tests,
      })),
    }
  }
  return {
    ...base,
    request: run.request,
    response: compactResponse(run.response),
    tests: run.tests,
    error: run.error,
  }
}

function compactResponse(response) {
  if (!isPlainObject(response)) return response
  return {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    durationMs: response.durationMs,
    url: response.url,
    headers: response.headers,
    cookies: response.cookies,
    body: typeof response.body === 'string' ? response.body.slice(0, 4000) : response.body,
    truncated: response.truncated,
    error: response.error,
  }
}

function normalizeReportText(text) {
  let value = String(text ?? '').trim()
  if (value.startsWith('```')) {
    value = value.replace(/^```(?:markdown|md)?\s*/i, '').replace(/```\s*$/, '').trim()
  }
  return value
}

function fallbackReport(run, reason) {
  const summary = run.summary ?? summarizeRun(run)
  const lines = [
    `# ${run.title ?? '测试'} · 分析报告`,
    '',
    `- 运行 ID：\`${run.id}\``,
    `- 时间：${run.createdAt ?? ''}`,
    `- 结果：**${run.passed ? 'PASS' : 'FAIL'}**`,
    `- 类型：${run.kind === 'flow' ? '业务流程' : '单接口'}`,
    '',
    '## 结论',
    '',
    run.passed
      ? '本次运行通过。所有已执行的步骤和断言均满足预期。'
      : '本次运行失败。请根据下述失败定位修复接口、断言或流程依赖。',
    reason.length > 0 ? `\n> AI 分析不可用：${reason}\n` : '',
    '## 关键指标',
    '',
    '| 指标 | 值 |',
    '| --- | --- |',
    `| 执行步骤 | ${summary.executed} |`,
    `| 通过步骤 | ${summary.passed} |`,
    `| 失败步骤 | ${summary.failed} |`,
    `| 断言总数 | ${summary.tests.total} |`,
    `| 断言通过 | ${summary.tests.passed} |`,
    `| 断言失败 | ${summary.tests.failed} |`,
    `| 平均耗时 | ${summary.avgLatencyMs}ms |`,
    `| 最大耗时 | ${summary.maxLatencyMs}ms |`,
    '',
    '## 失败定位',
    '',
  ]
  const steps = Array.isArray(run.steps) ? run.steps : [run]
  let any = false
  for (const step of steps) {
    const failures = (step.tests ?? []).filter((test) => !test.passed)
    const extractErrors = step.extractErrors ?? []
    if (failures.length === 0 && extractErrors.length === 0 && step.passed !== false) continue
    any = true
    lines.push(`### ${step.stepName ?? step.requestName ?? '请求'}`)
    lines.push('')
    if (step.response?.status !== undefined) lines.push(`- 状态码：${step.response.status}`)
    if (step.response?.durationMs !== undefined) lines.push(`- 耗时：${step.response.durationMs}ms`)
    for (const failure of failures) lines.push(`- 断言失败：${failure.name} — ${failure.message}`)
    for (const error of extractErrors) lines.push(`- 变量提取失败：${error}`)
    if (step.response?.body) {
      lines.push('', '响应片段：', '', '```json', String(step.response.body).slice(0, 1200), '```')
    }
    lines.push('')
  }
  if (!any) lines.push('没有失败的步骤或断言。', '')
  lines.push('## 风险与回归建议', '', '- 将失败场景补充为固定断言，避免只依赖人工观察。', '- 为关键流程增加异常分支（鉴权失败、参数缺失、超时），并纳入回归。', '- 在 CI 或定时任务中重跑该流程，保留运行记录作为趋势基线。', '', '## 复现步骤', '')
  if (Array.isArray(run.steps)) {
    run.steps.forEach((step, index) => lines.push(`${index + 1}. 调用「${step.stepName ?? step.requestName}」：${step.request?.method ?? ''} ${step.request?.url ?? ''}`))
  } else {
    lines.push(`1. 调用「${run.requestName ?? run.title}」：${run.request?.method ?? ''} ${run.request?.url ?? ''}`)
  }
  lines.push('')
  return lines.join('\n')
}

async function streamAiText(ctx, system, user, maxTokens) {
  const llm = ctx.get('llm')
  if (llm === undefined || typeof llm.stream !== 'function') throw new StudioError('模型服务不可用', 400)
  const selection = resolveModelSelection(ctx)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(new Error('AI 调用超时')), AI_TIMEOUT_MS)
  timer.unref?.()
  let text = ''
  try {
    const options = {
      provider: selection.provider,
      model: selection.model,
      system,
      messages: [{ role: 'user', content: [{ type: 'text', text: user }] }],
      maxTokens,
      signal: controller.signal,
    }
    for await (const chunk of llm.stream(options)) {
      if (chunk.type === 'text-delta') text += chunk.text
      else if (chunk.type === 'finish') {
        const reason = chunk.reason
        if (reason?.kind === 'error' || reason?.kind === 'aborted') {
          throw new Error(reason.failure?.message ?? `AI ${reason.kind}`)
        }
      }
    }
  } catch (error) {
    throw new StudioError(`AI 调用失败：${messageOf(error)}`, 502)
  } finally {
    clearTimeout(timer)
  }
  if (text.trim().length === 0) throw new StudioError('AI 返回为空', 502)
  return text
}

function extractJson(text) {
  const source = String(text ?? '').trim()
  const direct = tryParseJson(source)
  if (direct !== undefined) return direct
  for (const match of source.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)) {
    const parsed = tryParseJson(match[1].trim())
    if (parsed !== undefined) return parsed
  }
  for (const open of ['{', '[']) {
    const start = source.indexOf(open)
    if (start < 0) continue
    const end = findMatching(source, start)
    if (end < 0) continue
    const parsed = tryParseJson(source.slice(start, end + 1))
    if (parsed !== undefined) return parsed
  }
  return undefined
}

function tryParseJson(text) {
  try {
    const value = JSON.parse(text)
    return isPlainObject(value) || Array.isArray(value) ? value : undefined
  } catch {
    return undefined
  }
}

function findMatching(text, start) {
  const open = text[start]
  const close = open === '{' ? '}' : ']'
  let depth = 0
  let inString = false
  let escaped = false
  for (let index = start; index < text.length; index += 1) {
    const char = text[index]
    if (inString) {
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === '"') inString = false
      continue
    }
    if (char === '"') inString = true
    else if (char === open) depth += 1
    else if (char === close) {
      depth -= 1
      if (depth === 0) return index
    }
  }
  return -1
}

/* ------------------------------------------------------------------ */
/* Agent tool                                                          */
/* ------------------------------------------------------------------ */

function selfTest() {
  const checks = []
  const assert = (condition, message) => { if (!condition) throw new Error(message) }
  const run = (name, fn) => {
    try {
      const detail = fn()
      checks.push({ name, passed: true, detail: detail ?? '' })
    } catch (error) {
      checks.push({ name, passed: false, detail: messageOf(error) })
    }
  }
  run('renderValue', () => {
    const value = renderValue('{{name}}/{{$randomInt}}', { name: 'airpost' })
    assert(value.startsWith('airpost/') && value.length > 9, `unexpected ${value}`)
    return value
  })
  run('json-schema-validator', () => {
    const schema = { type: 'object', required: ['id'], properties: { id: { type: 'number' } } }
    assert(validateJsonSchema({ id: 1 }, schema, '$').length === 0, 'valid schema rejected')
    assert(validateJsonSchema({ id: 'x' }, schema, '$').length > 0, 'invalid schema accepted')
    return 'valid/invalid both handled'
  })
  run('smart-mock-schema', () => {
    const data = smartMockFromSchema({ type: 'object', properties: { id: { type: 'integer' }, email: { type: 'string', format: 'email' } } })
    assert(typeof data.id === 'number', 'id is not numeric')
    assert(String(data.email).includes('@'), 'email is not an email')
    return JSON.stringify(data)
  })
  run('parse-curl', () => {
    const request = parseCurl("curl -X POST 'https://example.test/api?q=1' -H 'content-type: application/json' -d '{\"a\":1}'")
    assert(request.method === 'POST', 'method mismatch')
    assert(request.query[0]?.key === 'q', 'query mismatch')
    assert(request.body.type === 'json', 'body mismatch')
    return `${request.method} ${request.url}`
  })
  run('parse-postman', () => {
    const requests = parsePostmanCollection(JSON.stringify({ info: { schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' }, item: [{ name: 'Ping', request: { method: 'GET', url: 'https://example.test/ping?x=1', header: [] } }] }))
    assert(requests.length === 1 && requests[0].url === 'https://example.test/ping', 'postman mismatch')
    return requests[0].name
  })
  run('parse-openapi', () => {
    const requests = parseOpenApiDocument(JSON.stringify({ openapi: '3.0.3', servers: [{ url: 'https://api.test' }], paths: { '/users/{id}': { get: { summary: 'Get user', parameters: [{ name: 'q', in: 'query', example: 'a' }] } } } }))
    assert(requests.length === 1, 'openapi count mismatch')
    assert(requests[0].url.endsWith('/users/{{id}}'), 'path template mismatch')
    return requests[0].url
  })
  run('parse-har', () => {
    const requests = parseHarDocument(JSON.stringify({ log: { entries: [{ request: { method: 'GET', url: 'https://example.test/a?x=1', headers: [], queryString: [{ name: 'x', value: '1' }] } }] } }))
    assert(requests.length === 1 && requests[0].query[0]?.key === 'x', 'har mismatch')
    return requests[0].url
  })
  run('export-curl', () => {
    const text = exportCurl({ method: 'POST', url: 'https://example.test/a', headers: [{ key: 'x-test', value: '1', enabled: true }], query: [], cookies: [], body: { type: 'json', text: '{"a":1}' }, auth: { type: 'none' } })
    assert(text.includes('-X POST') && text.includes('x-test: 1'), 'curl export mismatch')
    return text
  })
  run('export-openapi', () => {
    const document = exportOpenApi([{ name: 'Get', description: '', folder: 'Users', method: 'GET', url: '{{baseUrl}}/users/{{id}}', headers: [], query: [], body: { type: 'none', text: '', fields: [] }, examples: [], cases: [],
    }], { variables: { baseUrl: 'https://api.test' }, environments: [], activeEnvironmentId: '', globalHeaders: [], globalQuery: [] })
    assert(document.paths['/users/{id}'], 'openapi path missing')
    assert(document.servers[0].url === 'https://api.test', 'openapi server mismatch')
    return Object.keys(document.paths).join(',')
  })
  run('mock-path', () => {
    const params = matchMockPath('/users/:id', '/users/42')
    assert(params && params.id === '42', 'mock path param mismatch')
    return JSON.stringify(params)
  })
  return { passed: checks.filter((entry) => entry.passed).length, failed: checks.filter((entry) => !entry.passed).length, checks }
}

async function runAll(ctx, params = {}) {
  const requestFilter = Array.isArray(params.requestIds) ? new Set(params.requestIds.filter((id) => typeof id === 'string')) : undefined
  const requests = (await listRequests(ctx)).filter((request) => requestFilter === undefined || requestFilter.has(request.id))
  const flows = params.includeFlows === false ? [] : await listFlows(ctx)
  const environmentIds = Array.isArray(params.environmentIds) && params.environmentIds.length > 0
    ? [...new Set(params.environmentIds.filter((id) => typeof id === 'string'))]
    : [typeof params.environmentId === 'string' ? params.environmentId : '']
  const runs = []
  const matrix = []
  for (const environmentId of environmentIds) {
    const envRuns = []
    for (const request of requests) {
      try {
        envRuns.push(await executeSingle(ctx, request, {}, environmentId))
      } catch (error) {
        envRuns.push({ kind: 'request', title: request.name, error: messageOf(error) })
      }
    }
    for (const flow of flows) {
      try {
        envRuns.push(await executeFlow(ctx, flow, {}, undefined, environmentId))
      } catch (error) {
        envRuns.push({ kind: 'flow', title: flow.name, error: messageOf(error) })
      }
    }
    runs.push(...envRuns)
    matrix.push({
      environmentId: environmentId || null,
      count: envRuns.length,
      passed: envRuns.filter((run) => run.passed === true).length,
      failed: envRuns.filter((run) => run.passed !== true).length,
      runs: envRuns.map((run) => ({
        id: run.id,
        kind: run.kind,
        title: run.title,
        passed: run.passed,
        error: run.error,
        summary: run.summary,
      })),
    })
  }
  return {
    count: runs.length,
    passed: runs.filter((run) => run.passed === true).length,
    failed: runs.filter((run) => run.passed !== true).length,
    matrix,
    runs: runs.map((run) => ({
      id: run.id,
      kind: run.kind,
      title: run.title,
      passed: run.passed,
      error: run.error,
      summary: run.summary,
    })),
  }
}

function createTool(ctx) {
  return {
    name: 'api_studio',
    description:
      'AirPost: define, save, run, and analyze HTTP requests and multi-step business flows in the current workspace (.api-studio). ' +
      'Use action "bootstrap" to inspect existing requests/flows, "save_request"/"save_flow" to persist definitions, ' +
      '"import_data" to import cURL/OpenAPI/Postman/HAR, "export_data" to export, "run_all" to batch-run, ' +
      '"run_request"/"run_flow" to execute them, "self_test" to run internal regression checks, "ai_create" to turn a natural-language brief into saved tests, ' +
      'and "ai_analyze" to produce an AI report for a run. Prefer ai_create when the user asks in natural language.',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          description: 'Operation to perform.',
          enum: [
            'bootstrap',
            'save_request',
            'list_history',
            'restore_history',
            'save_flow',
            'delete_request',
            'delete_flow',
            'get_request',
            'get_flow',
            'run_request',
            'run_case',
            'run_flow',
            'run_flow_dataset',
            'list_runs',
            'get_run',
            'save_variables',
            'save_environments',
            'import_data',
            'export_data',
            'run_all',
            'list_reports',
            'read_report',
            'delete_report',
            'ai_create',
            'ai_analyze',
            'self_test',
          ],
        },
        requestId: { type: 'string' },
        revisionId: { type: 'string' },
        flowId: { type: 'string' },
        runId: { type: 'string' },
        reportId: { type: 'string' },
        force: { type: 'boolean' },
        request: { type: 'object', additionalProperties: true },
        case: { type: 'object', additionalProperties: true },
        caseId: { type: 'string' },
        flow: { type: 'object', additionalProperties: true },
        variables: { type: 'object', additionalProperties: true },
        environments: { type: 'array', items: { type: 'object', additionalProperties: true } },
        environmentId: { type: 'string' },
        environmentIds: { type: 'array', items: { type: 'string' } },
        requestIds: { type: 'array', items: { type: 'string' } },
        includeFlows: { type: 'boolean' },
        mergeStrategy: { type: 'string', enum: ['merge', 'replace'] },
        activeEnvironmentId: { type: 'string' },
        globalHeaders: { type: 'array', items: { type: 'object', additionalProperties: true } },
        globalQuery: { type: 'array', items: { type: 'object', additionalProperties: true } },
        source: { type: 'string', enum: ['auto', 'curl', 'openapi', 'swagger', 'postman', 'postman-env', 'har', 'insomnia', 'insomnia-env', 'yapi', 'workspace'] },
        target: { type: 'string', enum: ['openapi', 'postman', 'postman-env', 'markdown', 'html', 'workspace', 'insomnia', 'insomnia-env', 'yapi', 'curl'] },
        text: { type: 'string' },
        prompt: { type: 'string' },
        kind: { type: 'string', enum: ['request', 'flow', 'auto'] },
      },
      required: ['action'],
      additionalProperties: false,
    },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render(_args, value) {
        return [{ type: 'text', text: JSON.stringify(value, null, 2) }]
      },
    },
    execute: async (args, exec) => {
      if (!isPlainObject(args) || typeof args.action !== 'string') {
        throw new StudioError('action is required', 400)
      }
      const agentId = exec?.agent?.id
      const scoped = typeof agentId === 'string' ? { ...args, sessionId: agentId } : args
      const result = await callStudio(ctx, scoped.action, scoped)
      const parsed = JSON.parse(JSON.stringify(result ?? null))
      return Array.isArray(parsed) ? { items: parsed } : parsed
    },
  }
}

/* ------------------------------------------------------------------ */
/* Normalization                                                       */
/* ------------------------------------------------------------------ */

function normalizeExamples(value) {
  if (!Array.isArray(value)) return []
  return value
    .filter((entry) => isPlainObject(entry))
    .map((entry, index) => ({
      id: typeof entry.id === 'string' && ID_PATTERN.test(entry.id) ? entry.id : `example-${index + 1}`,
      name: String(entry.name ?? `Example ${index + 1}`).trim() || `Example ${index + 1}`,
      status: clampNumber(entry.status ?? 200, 100, 599),
      headers: asEntries(entry.headers),
      body: String(entry.body ?? ''),
      createdAt: typeof entry.createdAt === 'string' ? entry.createdAt : nowIso(),
    }))
}

function normalizeMockConditions(value) {
  if (!Array.isArray(value)) return []
  return value
    .filter((entry) => isPlainObject(entry))
    .map((entry) => ({
      source: entry.source === 'header' ? 'header' : 'query',
      key: String(entry.key ?? '').trim(),
      value: String(entry.value ?? ''),
      enabled: entry.enabled !== false,
    }))
    .filter((entry) => entry.key.length > 0)
}

function mockConditionsMatch(conditions, target, headers) {
  if (!Array.isArray(conditions) || conditions.length === 0) return true
  let query
  try { query = new URL(target, 'http://127.0.0.1').searchParams } catch { query = new URLSearchParams() }
  return conditions.every((condition) => {
    if (condition.enabled === false) return true
    const actual = condition.source === 'header' ? headers[condition.key.toLowerCase()] : query.get(condition.key)
    return String(actual ?? '') === condition.value
  })
}

function normalizeMock(source, existing) {
  const value = isPlainObject(source) ? source : {}
  const fallback = isPlainObject(existing) ? existing : {}
  return {
    enabled: typeof value.enabled === 'boolean' ? value.enabled : fallback.enabled === true,
    status: clampNumber(value.status ?? fallback.status ?? 200, 100, 599),
    delayMs: clampNumber(value.delayMs ?? fallback.delayMs ?? 0, 0, 60000),
    smart: typeof value.smart === 'boolean' ? value.smart : fallback.smart === true,
    schema: isPlainObject(value.schema) ? value.schema : isPlainObject(fallback.schema) ? fallback.schema : undefined,
    exampleId: String(value.exampleId ?? fallback.exampleId ?? ''),
    path: String(value.path ?? fallback.path ?? '').trim(),
    conditions: normalizeMockConditions(value.conditions !== undefined ? value.conditions : fallback.conditions),
    headers: value.headers !== undefined ? asEntries(value.headers) : Array.isArray(fallback.headers) ? fallback.headers : [],
    body: String(value.body ?? fallback.body ?? ''),
  }
}

function normalizeRequestCases(value) {
  if (!Array.isArray(value)) return []
  return value
    .filter((entry) => isPlainObject(entry))
    .map((entry, index) => ({
      id: typeof entry.id === 'string' && ID_PATTERN.test(entry.id) ? entry.id : `case-${index + 1}`,
      name: String(entry.name ?? `Case ${index + 1}`).trim() || `Case ${index + 1}`,
      overrides: isPlainObject(entry.overrides) ? entry.overrides : {},
    }))
}

function normalizeRequest(input, existing, fallbackId) {
  const source = isPlainObject(input) ? input : {}
  const id = typeof source.id === 'string' && ID_PATTERN.test(source.id) ? source.id : typeof existing?.id === 'string' ? existing.id : fallbackId
  const method = METHODS.has(String(source.method ?? existing?.method ?? 'GET').toUpperCase())
    ? String(source.method ?? existing?.method ?? 'GET').toUpperCase()
    : 'GET'
  const headers = source.headers !== undefined ? asEntries(source.headers) : existing?.headers ?? []
  const query = source.query !== undefined ? asEntries(source.query) : existing?.query ?? []
  const body = source.body !== undefined || source.bodyType !== undefined || source.bodyText !== undefined
    ? normalizeBody(source)
    : existing?.body ?? { type: 'none', text: '' }
  const auth = source.auth !== undefined ? normalizeAuth(source.auth) : existing?.auth ?? { type: 'none' }
  const tests = source.tests !== undefined ? normalizeTests(source.tests) : existing?.tests ?? []
  const timeoutMs = clampNumber(source.timeoutMs ?? existing?.timeoutMs ?? DEFAULT_TIMEOUT_MS, 1000, 120000)
  const followRedirects = typeof source.followRedirects === 'boolean' ? source.followRedirects : existing?.followRedirects !== false
  return {
    id,
    name: String(source.name ?? existing?.name ?? '未命名接口').trim(),
    description: String(source.description ?? existing?.description ?? ''),
    folder: String(source.folder ?? existing?.folder ?? '').trim(),
    method,
    url: String(source.url ?? existing?.url ?? '').trim(),
    headers: headers.map(normalizeEntry),
    query: query.map(normalizeEntry),
    cookies: source.cookies !== undefined ? asEntries(source.cookies) : existing?.cookies ?? [],
    body,
    auth,
    tests,
    timeoutMs,
    followRedirects,
    mock: normalizeMock(source.mock, existing?.mock),
    examples: normalizeExamples(source.examples !== undefined ? source.examples : existing?.examples),
    cases: normalizeRequestCases(source.cases !== undefined ? source.cases : existing?.cases),
    preScript: String(source.preScript ?? existing?.preScript ?? ''),
    postScript: String(source.postScript ?? existing?.postScript ?? ''),
    variables: normalizeVariables(source.variables ?? existing?.variables ?? {}),
    createdAt: typeof source.createdAt === 'string' ? source.createdAt : existing?.createdAt,
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : existing?.updatedAt,
  }
}

function normalizeFlow(input, existing, fallbackId) {
  const source = isPlainObject(input) ? input : {}
  const id = typeof source.id === 'string' && ID_PATTERN.test(source.id) ? source.id : typeof existing?.id === 'string' ? existing.id : fallbackId
  const rawSteps = Array.isArray(source.steps) ? source.steps : []
  const steps = rawSteps.map((step, index) => normalizeStep(step, index))
  return {
    id,
    name: String(source.name ?? existing?.name ?? '未命名流程').trim(),
    description: String(source.description ?? existing?.description ?? ''),
    folder: String(source.folder ?? existing?.folder ?? '').trim(),
    variables: normalizeVariables(source.variables ?? existing?.variables ?? {}),
    stopOnFailure: typeof source.stopOnFailure === 'boolean' ? source.stopOnFailure : existing?.stopOnFailure !== false,
    dataset: Array.isArray(source.dataset) ? source.dataset.filter((entry) => isPlainObject(entry)).map(normalizeVariables) : Array.isArray(existing?.dataset) ? existing.dataset : [],
    steps,
    createdAt: typeof source.createdAt === 'string' ? source.createdAt : existing?.createdAt,
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : existing?.updatedAt,
  }
}

function normalizeStep(step, index) {
  const source = isPlainObject(step) ? step : {}
  return {
    id: typeof source.id === 'string' && source.id.length > 0 ? source.id : `step-${index + 1}`,
    name: String(source.name ?? `步骤 ${index + 1}`).trim(),
    requestId: String(source.requestId ?? source.request_id ?? '').trim(),
    request: source.request,
    overrides: isPlainObject(source.overrides) ? source.overrides : {},
    extract: normalizeExtract(source.extract),
    continueOnFailure: source.continueOnFailure === true,
    condition: String(source.condition ?? '').trim(),
    delayMs: clampNumber(source.delayMs ?? 0, 0, 60000),
  }
}

function normalizeExtract(value) {
  if (Array.isArray(value)) {
    return value
      .filter((entry) => isPlainObject(entry))
      .map((entry) => ({
        name: String(entry.name ?? entry.variable ?? '').trim(),
        from: ['body', 'header', 'status', 'regex'].includes(entry.from) ? entry.from : 'body',
        path: String(entry.path ?? entry.jsonPath ?? entry.name ?? ''),
        regex: entry.regex,
        group: entry.group,
      }))
      .filter((entry) => entry.name.length > 0)
  }
  if (isPlainObject(value)) {
    return Object.entries(value).map(([name, path]) => {
      const raw = String(path ?? '')
      if (raw.startsWith('header.')) return { name, from: 'header', path: raw.slice('header.'.length) }
      if (raw.startsWith('status')) return { name, from: 'status', path: '' }
      if (raw.startsWith('body.')) return { name, from: 'body', path: raw.slice('body.'.length) }
      return { name, from: 'body', path: raw }
    })
  }
  return []
}

function normalizeEntry(entry) {
  return {
    key: String(entry.key ?? entry.name ?? ''),
    value: String(entry.value ?? ''),
    enabled: entry.enabled !== false,
  }
}

function asEntries(value) {
  if (Array.isArray(value)) {
    return value.filter((entry) => isPlainObject(entry)).map(normalizeEntry)
  }
  if (isPlainObject(value)) {
    return Object.entries(value).map(([key, entryValue]) => ({ key, value: String(entryValue ?? ''), enabled: true }))
  }
  return []
}

function normalizeBody(source) {
  const rawType = source.bodyType ?? (isPlainObject(source.body) ? source.body.type : undefined)
  let type = ['none', 'json', 'text', 'form', 'multipart'].includes(rawType) ? rawType : undefined
  let text = ''
  if (isPlainObject(source.body)) {
    text = source.body.text ?? source.body.raw ?? source.body.content ?? ''
    if (typeof text !== 'string') text = JSON.stringify(text, null, 2)
  } else if (typeof source.body === 'string') {
    text = source.body
  } else if (typeof source.bodyText === 'string') {
    text = source.bodyText
  }
  if (type === undefined) {
    if (text.trim().length === 0) type = 'none'
    else type = looksLikeJson(text) ? 'json' : 'text'
  }
  const rawFields = isPlainObject(source.body) && Array.isArray(source.body.fields) ? source.body.fields : []
  const fields = rawFields.filter(isPlainObject).map((entry) => ({
    key: String(entry.key ?? ''),
    value: String(entry.value ?? ''),
    enabled: entry.enabled !== false,
    type: entry.type === 'file' ? 'file' : 'text',
    filename: String(entry.filename ?? ''),
    contentType: String(entry.contentType ?? ''),
    data: String(entry.data ?? ''),
  }))
  return { type, text: String(text), fields }
}

function normalizeAuth(value) {
  const source = isPlainObject(value) ? value : {}
  const type = ['none', 'bearer', 'basic', 'apiKey', 'oauth2', 'digest', 'oauth1', 'hawk', 'aws'].includes(source.type) ? source.type : 'none'
  return {
    type,
    token: String(source.token ?? source.bearer ?? ''),
    username: String(source.username ?? ''),
    password: String(source.password ?? ''),
    key: String(source.key ?? ''),
    value: String(source.value ?? ''),
    in: source.in === 'query' ? 'query' : 'header',
    tokenUrl: String(source.tokenUrl ?? ''),
    clientId: String(source.clientId ?? ''),
    clientSecret: String(source.clientSecret ?? ''),
    scope: String(source.scope ?? ''),
    clientAuth: source.clientAuth === 'basic' ? 'basic' : 'body',
    consumerKey: String(source.consumerKey ?? ''),
    consumerSecret: String(source.consumerSecret ?? ''),
    oauthToken: String(source.oauthToken ?? source.token ?? ''),
    oauthTokenSecret: String(source.oauthTokenSecret ?? source.tokenSecret ?? ''),
    signatureMethod: ['HMAC-SHA1', 'PLAINTEXT'].includes(source.signatureMethod) ? source.signatureMethod : 'HMAC-SHA1',
    realm: String(source.realm ?? ''),
    hawkId: String(source.hawkId ?? ''),
    hawkKey: String(source.hawkKey ?? ''),
    hawkAlgorithm: source.hawkAlgorithm === 'sha1' ? 'sha1' : 'sha256',
    hawkExt: String(source.hawkExt ?? ''),
    hawkPayloadHash: source.hawkPayloadHash === true,
    awsAccessKey: String(source.awsAccessKey ?? ''),
    awsSecretKey: String(source.awsSecretKey ?? ''),
    awsRegion: String(source.awsRegion ?? 'us-east-1'),
    awsService: String(source.awsService ?? 'execute-api'),
    awsSessionToken: String(source.awsSessionToken ?? ''),
  }
}

function normalizeTests(value) {
  if (typeof value === 'string') return [{ type: 'script', code: value, enabled: true }]
  if (!Array.isArray(value)) {
    if (isPlainObject(value)) {
      if (typeof value.type === 'string') return [normalizeTest(value)]
      return Object.entries(value).map(([key, expected]) => normalizeTest({ type: key, value: expected }))
    }
    return []
  }
  return value.filter((entry) => isPlainObject(entry)).map(normalizeTest)
}

function normalizeTest(entry) {
  const type = String(entry.type ?? 'status').toLowerCase()
  const test = {
    type,
    name: typeof entry.name === 'string' ? entry.name : undefined,
    op: typeof entry.op === 'string' ? entry.op : typeof entry.operator === 'string' ? entry.operator : defaultOperator(type),
    value: entry.value ?? entry.expected ?? '',
    enabled: entry.enabled !== false,
  }
  if (type === 'json') test.path = String(entry.path ?? entry.jsonPath ?? '')
  if (type === 'header') test.header = String(entry.header ?? entry.path ?? '')
  if (type === 'script') test.code = String(entry.code ?? entry.script ?? '')
  if (type === 'schema') test.schema = isPlainObject(entry.schema) ? entry.schema : undefined
  if (type === 'body') test.path = entry.path
  return test
}

function normalizeVariables(value) {
  if (!isPlainObject(value)) return {}
  const result = {}
  for (const [key, raw] of Object.entries(value)) {
    if (raw === null || raw === undefined) continue
    if (['string', 'number', 'boolean'].includes(typeof raw)) result[key] = String(raw)
  }
  return result
}

function activeEnvironmentVariables(workspace) {
  const active = (workspace.environments ?? []).find((entry) => entry.id === workspace.activeEnvironmentId)
  return {
    ...workspace.variables,
    ...(active?.variables ?? {}),
  }
}

function runtimeVariables(workspaceVariables, extra, runId) {
  return {
    runId: runId ?? newId('run'),
    uuid: randomUUID(),
    timestamp: String(Date.now()),
    now: new Date().toISOString(),
    ...workspaceVariables,
    ...normalizeVariables(extra),
  }
}

function dynamicValue(name) {
  const randomInt = (min, max) => String(Math.floor(Math.random() * (max - min + 1)) + min)
  const randomString = (length = 10) => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let out = ''
    for (let index = 0; index < length; index += 1) out += alphabet[Math.floor(Math.random() * alphabet.length)]
    return out
  }
  const randomWord = () => ['alpha', 'bravo', 'delta', 'echo', 'foxtrot', 'golf', 'hotel', 'india', 'juliet', 'kilo'][Math.floor(Math.random() * 10)]
  const randomName = () => ['Alice', 'Bob', 'Carol', 'Daniel', 'Eva', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack'][Math.floor(Math.random() * 10)]
  if (name === '$timestamp') return String(Date.now())
  if (name === '$isoTimestamp' || name === '$now') return new Date().toISOString()
  if (name === '$uuid' || name === '$guid' || name === '$randomUUID') return randomUUID()
  if (name === '$randomBoolean') return String(Math.random() >= 0.5)
  if (name === '$randomInt') return randomInt(0, 1000)
  if (name === '$randomString') return randomString(10)
  if (name === '$randomWord') return randomWord()
  if (name === '$randomName') return randomName()
  if (name === '$randomEmail') return `${randomName().toLowerCase()}.${randomString(5).toLowerCase()}@example.com`
  if (name === '$randomCity') return ['Shanghai', 'Beijing', 'Shenzhen', 'Hangzhou', 'Chengdu'][Math.floor(Math.random() * 5)]
  if (name === '$randomCountry') return ['China', 'Japan', 'Singapore', 'Germany', 'Canada'][Math.floor(Math.random() * 5)]
  if (name === '$randomPhone') return `1${randomInt(3, 9)}${randomInt(100000000, 999999999)}`
  if (name === '$randomDate') return new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toISOString()
  if (name === '$randomPastDate') return new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toISOString()
  if (name === '$randomFutureDate') return new Date(Date.now() + Math.floor(Math.random() * 31536000000)).toISOString()
  const range = /^\$randomInt\((-?\d+)\s*,\s*(-?\d+)\)$/.exec(name)
  if (range) {
    const min = Number(range[1])
    const max = Number(range[2])
    if (Number.isFinite(min) && Number.isFinite(max)) return randomInt(Math.min(min, max), Math.max(min, max))
  }
  const sized = /^\$randomString\((\d+)\)$/.exec(name)
  if (sized) return randomString(Math.max(1, Math.min(200, Number(sized[1]) || 10)))
  return undefined
}

function renderValue(value, variables, missing) {
  if (typeof value === 'string') {
    return value.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (match, rawName) => {
      const name = rawName.trim()
      if (name.startsWith('$')) {
        const dynamic = dynamicValue(name)
        if (dynamic !== undefined) return dynamic
      }
      const resolved = variables[name]
      if (resolved === undefined || resolved === null) {
        missing.push(name)
        return match
      }
      return String(resolved)
    })
  }
  if (Array.isArray(value)) return value.map((entry) => renderValue(entry, variables, missing))
  if (isPlainObject(value)) {
    const result = {}
    for (const [key, entry] of Object.entries(value)) result[key] = renderValue(entry, variables, missing)
    return result
  }
  return value
}

/* ------------------------------------------------------------------ */
/* Small utilities                                                     */
/* ------------------------------------------------------------------ */

function getByPath(value, path) {
  if (path === undefined || path === null || String(path).length === 0 || String(path) === '$') return value
  const normalized = String(path)
    .replace(/^\$\.?/, '')
    .replace(/\[["']?([^"'\]]+)["']?\]/g, '.$1')
  const segments = normalized.split('.').filter((segment) => segment.length > 0)
  let current = value
  for (const segment of segments) {
    if (current === undefined || current === null) return undefined
    current = current[segment]
  }
  return current
}

function setHeader(headers, key, value) {
  const existing = Object.keys(headers).find((name) => name.toLowerCase() === key.toLowerCase())
  headers[existing ?? key] = String(value)
}

function hasHeader(headers, key) {
  return Object.keys(headers).some((name) => name.toLowerCase() === key.toLowerCase())
}

function smartMockFromSchema(schema, key = '') {
  if (!isPlainObject(schema)) return smartMockValue('', key)
  if (schema.example !== undefined) return schema.example
  if (schema.default !== undefined) return schema.default
  if (Array.isArray(schema.enum) && schema.enum.length > 0) return schema.enum[0]
  if (Array.isArray(schema.oneOf) && schema.oneOf.length > 0) return smartMockFromSchema(schema.oneOf[0], key)
  if (Array.isArray(schema.anyOf) && schema.anyOf.length > 0) return smartMockFromSchema(schema.anyOf[0], key)
  if (Array.isArray(schema.allOf) && schema.allOf.length > 0) {
    return Object.assign({}, ...schema.allOf.map((entry) => smartMockFromSchema(entry, key)))
  }
  const type = schema.type
  if (type === 'object' || isPlainObject(schema.properties)) {
    const object = {}
    for (const [childKey, child] of Object.entries(schema.properties ?? {})) object[childKey] = smartMockFromSchema(child, childKey)
    return object
  }
  if (type === 'array') return [smartMockFromSchema(schema.items ?? {}, key)]
  if (type === 'boolean') return Math.random() >= 0.5
  if (type === 'integer' || type === 'number') return Math.floor(Math.random() * 1000) + 1
  if (type === 'null') return null
  const formatKey = schema.format === 'email' ? 'email' : schema.format === 'date-time' ? 'createdAt' : schema.format === 'uri' ? 'url' : schema.format === 'uuid' ? 'uuid' : key
  return smartMockValue('', formatKey)
}

function smartMockJson(template) {
  const source = String(template ?? '').trim()
  if (source.length === 0) return source
  try {
    return JSON.stringify(smartMockValue(JSON.parse(source), ''), null, 2)
  } catch {
    return source
  }
}

function smartMockValue(value, key) {
  if (Array.isArray(value)) return value.length === 0 ? [] : [smartMockValue(value[0], key)]
  if (isPlainObject(value)) {
    const result = {}
    for (const [childKey, child] of Object.entries(value)) result[childKey] = smartMockValue(child, childKey)
    return result
  }
  const name = String(key).toLowerCase()
  if (typeof value === 'number') {
    if (name.includes('id')) return Math.floor(Math.random() * 10000) + 1
    if (name.includes('price') || name.includes('amount')) return Math.round(Math.random() * 100000) / 100
    if (name.includes('age')) return Math.floor(Math.random() * 60) + 18
    return Math.floor(Math.random() * 1000)
  }
  if (typeof value === 'boolean') return Math.random() >= 0.5
  if (value === null) return Math.random().toString(36).slice(2, 10)
  if (typeof value === 'string') {
    const suffix = Math.random().toString(36).slice(2, 8)
    if (name.includes('uuid') || name.includes('guid')) return randomUUID()
    if (name.includes('email')) return `user_${suffix}@example.com`
    if (name.includes('name') || name.includes('title')) return `AirPost ${suffix}`
    if (name.includes('url') || name.includes('link')) return `https://example.com/${suffix}`
    if (name.includes('date') || name.includes('time') || name.includes('created') || name.includes('updated')) return new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toISOString()
    if (name.includes('phone') || name.includes('mobile')) return `1${Math.floor(Math.random() * 9000000000) + 1000000000}`
    if (name.includes('id')) return `${Math.floor(Math.random() * 100000)}`
    if (name.includes('status')) return ['active', 'pending', 'disabled'][Math.floor(Math.random() * 3)]
    if (name.includes('city')) return ['Shanghai', 'Beijing', 'Shenzhen'][Math.floor(Math.random() * 3)]
    if (name.includes('country')) return ['China', 'Japan', 'Singapore'][Math.floor(Math.random() * 3)]
    return `AirPost ${suffix}`
  }
  return value
}

function matchMockPath(pattern, target) {
  let path = target
  try { path = new URL(target, 'http://127.0.0.1').pathname } catch { path = target.split('?')[0] }
  const expected = String(pattern).split('?')[0].replace(/\/+$/, '') || '/'
  const actual = path.replace(/\/+$/, '') || '/'
  const expectedParts = expected.split('/').filter(Boolean)
  const actualParts = actual.split('/').filter(Boolean)
  if (expectedParts.length !== actualParts.length) return undefined
  const params = {}
  for (let index = 0; index < expectedParts.length; index += 1) {
    const expectedPart = expectedParts[index]
    if (expectedPart === '*') continue
    if (expectedPart.startsWith(':')) {
      params[expectedPart.slice(1)] = decodeURIComponent(actualParts[index])
      continue
    }
    if (expectedPart !== actualParts[index]) return undefined
  }
  return params
}

function parseSetCookies(headers) {
  let values = []
  try {
    values = headers.getSetCookie?.() ?? []
  } catch {
    values = []
  }
  return values.map((raw) => {
    const parts = String(raw).split(';').map((part) => part.trim())
    const first = parts.shift() ?? ''
    const equals = first.indexOf('=')
    const cookie = {
      name: equals > 0 ? first.slice(0, equals) : '',
      value: equals > 0 ? first.slice(equals + 1) : first,
      domain: '',
      path: '',
      expires: '',
      httpOnly: false,
      secure: false,
      sameSite: '',
    }
    for (const part of parts) {
      const index = part.indexOf('=')
      const key = (index > 0 ? part.slice(0, index) : part).toLowerCase()
      const value = index > 0 ? part.slice(index + 1) : ''
      if (key === 'domain') cookie.domain = value
      else if (key === 'path') cookie.path = value
      else if (key === 'expires') cookie.expires = value
      else if (key === 'httponly') cookie.httpOnly = true
      else if (key === 'secure') cookie.secure = true
      else if (key === 'samesite') cookie.sameSite = value
    }
    return cookie
  }).filter((cookie) => cookie.name.length > 0)
}

function headersToObject(headers) {
  const result = {}
  for (const [key, value] of headers) result[key.toLowerCase()] = value
  try {
    const cookies = headers.getSetCookie?.()
    if (Array.isArray(cookies) && cookies.length > 0) result['set-cookie'] = cookies.join('\n')
  } catch {
    // Older Headers implementations do not expose getSetCookie.
  }
  return result
}

function looksLikeJson(text) {
  const trimmed = String(text).trim()
  return trimmed.startsWith('{') || trimmed.startsWith('[')
}

function clampNumber(value, min, max) {
  const number = Number(value)
  if (!Number.isFinite(number)) return min
  return Math.min(max, Math.max(min, Math.round(number)))
}

function formatValue(value) {
  if (typeof value === 'string') return value.length > 200 ? `${value.slice(0, 200)}…` : value
  if (value === undefined) return 'undefined'
  try {
    const text = JSON.stringify(value)
    return text.length > 200 ? `${text.slice(0, 200)}…` : text
  } catch {
    return String(value)
  }
}

function newId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${randomUUID().slice(0, 6)}`
}

function nowIso() {
  return new Date().toISOString()
}

function requireId(value, name) {
  if (typeof value !== 'string' || !ID_PATTERN.test(value)) throw new StudioError(`${name} 无效`, 400)
  return value
}

function safeFile(directory, id, extension) {
  if (typeof id !== 'string' || !ID_PATTERN.test(id)) throw new StudioError(`无效的 id "${id}"`, 400)
  const file = join(directory, `${id}.${extension}`)
  if (!file.startsWith(directory + sep)) throw new StudioError('无效的路径', 400)
  return file
}

async function listJsonFiles(directory) {
  const entries = await readdir(directory).catch(() => [])
  return entries.filter((name) => name.endsWith('.json') && name !== 'index.json').map((name) => join(directory, name))
}

async function listFiles(directory, extension) {
  const entries = await readdir(directory).catch(() => [])
  return entries.filter((name) => name.endsWith(extension)).map((name) => join(directory, name))
}

async function readJson(file, fallback) {
  try {
    const text = await readFile(file, 'utf8')
    return JSON.parse(text)
  } catch (error) {
    if (error?.code === 'ENOENT') return fallback
    throw error
  }
}

async function writeJsonAtomic(file, value) {
  const temporary = `${file}.${process.pid}.${randomUUID()}.tmp`
  await mkdir(dirname(file), { recursive: true })
  await writeFile(temporary, JSON.stringify(value, null, 2), 'utf8')
  await rename(temporary, file)
}

async function exists(file) {
  try {
    await stat(file)
    return true
  } catch {
    return false
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function parseJsonInput(value, label) {
  try {
    return JSON.parse(value)
  } catch (error) {
    throw new StudioError(`${label} 不是合法 JSON：${messageOf(error)}`, 400)
  }
}

function messageOf(error) {
  if (error instanceof Error) return error.message
  return String(error)
}

function mediaType(value) {
  return typeof value === 'string' ? value.split(';', 1)[0]?.trim().toLowerCase() : undefined
}

async function readJsonBody(req) {
  let size = 0
  const chunks = []
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) throw new Error('request body is too large')
    chunks.push(chunk)
  }
  if (size === 0) return null
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new Error('body is not JSON')
  }
}

function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.end(JSON.stringify(payload))
}
