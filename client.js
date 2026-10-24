window.__ModuleLoader__.load({
  id: 'dsh-air-post',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const primitives = require('@deepseek-ai/dsh-client-ui-primitives')
    const {
      Button: DshButton,
      Input: DshInput,
      Checkbox: DshCheckbox,
      SegmentedTabs: DshSegmentedTabs,
      Modal: DshModal,
      Toast: DshToast,
      Tooltip: DshTooltip,
      Menu: DshMenu,
      Tag: DshTag,
      DisclosureRow: DshDisclosureRow,
      JsonTree: DshJsonTree,
      StateDot: DshStateDot,
      IconSearchOutlineRegular,
      IconPlusOutlineRegular,
      IconTrashOutlineRegular,
      IconCheckOutlineRegular,
      IconPlayOutlineRegular,
      IconRefreshOutlineRegular,
      IconCodeOutlineRegular,
      IconCloseOutlineRegular,
      IconChevronUpOutlineRegular,
      IconChevronDownOutlineRegular,
      IconChevronRightOutlineRegular,
      IconClockOutlineRegular,
      IconChecklistOutlineRegular,
      IconCopyOutlineRegular,
      IconDeliverDocRegular,
      IconDownloadOutlineRegular,
      IconFlatListOutlineRegular,
      IconPanelLeftOutlineRegular,
      IconLinkOutlineRegular,
      IconFolderOpenRegular,
      IconFolderCloseRegular,
      IconInfoOutlineRegular,
    } = primitives
    const NS = 'apiStudio'
    const ENDPOINT = 'api-studio'

    /* ------------------------------------------------------------------ */
    /* Locale                                                              */
    /* ------------------------------------------------------------------ */

    const en = {
      'panel.title': 'Interface Tests',
      'panel.subtitle': 'AirPost · requests, flows, and AI reports',
      'right.selectRequest': 'Select request',
      'right.selectFlow': 'Select flow',
      'right.selectRun': 'Select run',
      'right.selectReport': 'Select report',
      'project.title': 'Project',
      'project.env': 'Environment',
      'project.transfer': 'Import / Export',
      'project.active': 'Active environment',
      'project.newEnv': 'New environment',
      'project.duplicateEnv': 'Duplicate environment',
      'project.deleteEnv': 'Delete environment',
      'project.envName': 'Environment name',
      'project.envVars': 'Environment variables',
      'project.envSearch': 'Search variables',
      'project.addEnvVar': 'Add variable',
      'project.globalSearch': 'Search global variables',
      'project.addGlobalVar': 'Add global variable',
      'project.bulkPaste': 'Bulk paste',
      'project.bulkHint': 'One key=value per line. Existing keys are overwritten.',
      'project.bulkApply': 'Apply variables',
      'project.bulkPreview': '{count} variables · {invalid} invalid lines',
      'project.globalVars': 'Global variables',
      'project.globalHeaders': 'Global headers (JSON array)',
      'project.globalQuery': 'Global query (JSON array)',
      'project.save': 'Save project settings',
      'project.saved': 'Project settings saved',
      'project.import': 'Import',
      'project.export': 'Export',
      'project.action': 'Action',
      'project.source': 'Source',
      'project.target': 'Target',
      'project.input': 'Content',
      'project.output': 'Output',
      'project.copy': 'Copy',
      'project.download': 'Download',
      'project.imported': 'Imported {count} request(s)',
      'project.exported': 'Export ready',
      'project.importHint': 'Paste cURL, OpenAPI/Swagger JSON or YAML, Postman Collection JSON, HAR JSON, Insomnia JSON, YApi JSON, or AirPost workspace JSON.',
      'project.mergeStrategy': 'Environment merge strategy',
      'project.merge': 'Merge',
      'project.replace': 'Replace',
      'project.importPreview': 'Import preview',
      'project.previewNew': 'New',
      'project.previewUpdated': 'Updated',
      'project.previewSame': 'Unchanged',
      'project.previewSummary': '{newCount} new · {updatedCount} updated · {sameCount} unchanged',
      'project.exportHint': 'Export all requests as OpenAPI/Postman, or the selected request as cURL.',
      'project.copyDone': 'Copied',
      'project.noRequests': 'There are no requests to export.',
      'run.all': 'Run all',
      'run.trend': 'Recent runs',
      'run.last12': 'Last 12',
      'run.last24': 'Last 24',
      'run.allRuns': 'All',
      'run.avg': 'avg',
      'run.testMeter': 'Assertions passed',
      'run.compare': 'Compare',
      'run.comparePrevious': 'Compare with previous run',
      'run.noPrevious': 'No previous run for this request',
      'run.compareBodies': 'Response body diff',
      'run.previous': 'Previous',
      'run.current': 'Current',
      'run.noDiff': 'No body differences',
      'run.copyDiff': 'Copy diff',
      'run.diffCopied': 'Diff copied',
      'run.onlyChanged': 'Only changed lines',
      'run.foldSame': 'Fold unchanged lines',
      'run.unchangedLines': 'unchanged lines',
      'run.collapseAll': 'Collapse all',
      'run.headerDiff': 'Header differences',
      'run.range7': 'Last 7 days',
      'run.range30': 'Last 30 days',
      'run.rangeAll': 'All time',
      'run.noRuns': 'No runs in this range',
      'run.unified': 'Unified',
      'run.split': 'Side by side',
      'run.activeEnvironment': 'Active environment',
      'run.environment': 'Run environment',
      'run.matrix': 'Environment matrix',
      'run.matrixTitle': 'Multi-environment matrix',
      'run.matrixHint': 'Run one request (or all requests) across the selected environments.',
      'run.matrixEnvironments': 'Environments',
      'run.matrixRequest': 'Requests',
      'run.matrixAllRequests': 'All requests',
      'run.matrixIncludeFlows': 'Include flows',
      'run.matrixRun': 'Run matrix',
      'run.matrixEmpty': 'No matrix run yet.',
      'run.matrixDone': 'Matrix finished',
      'run.selfTest': 'Self test',
      'run.selfTestSummary': '{passed} passed · {failed} failed',
      'run.check': 'Check',
      'run.matrixGrouped': 'Grouped',
      'run.matrixTable': 'Matrix table',
      'run.matrixRequestCol': 'Request',
      'run.matrixCopy': 'Copy matrix (TSV)',
      'run.matrixDownload': 'Download matrix (TSV)',
      'run.matrixOnlyDiff': 'Only differences',
      'run.matrixDiff': 'diff',
      'run.matrixDiffReport': 'Download diff report',
      'run.matrixMarkdown': 'Download Markdown report',
      'run.matrixHtml': 'Download HTML report',
      'run.matrixSvg': 'Download chart SVG',
      'run.matrixPng': 'Download chart PNG',
      'run.matrixCopied': 'Matrix copied',
      'run.allDone': 'Batch finished: {passed} passed / {count} total',
      'nav.requests': 'Requests',
      'nav.flows': 'Flows',
      'nav.runs': 'Runs',
      'nav.reports': 'Reports',
      'nav.docs': 'Docs',
      'docs.title': 'API documentation',
      'docs.search': 'Search API docs',
      'docs.empty': 'No API definitions yet.',
      'docs.open': 'Open in request editor',
      'docs.noDescription': 'No description.',
      'docs.overview': 'Overview',
      'docs.body': 'Body',
      'docs.auth': 'Auth',
      'docs.cases': 'Cases',
      'docs.examples': 'Response examples',
      'docs.copyExample': 'Copy example body',
      'docs.exampleHeaders': 'Headers',
      'docs.showHeaders': 'Show headers',
      'docs.hideHeaders': 'Hide headers',
      'docs.exampleCopied': 'Example copied',
      'docs.copyExampleLink': 'Copy example section link',
      'docs.downloadExample': 'Download standalone HTML',
      'docs.exampleLinkCopied': 'Example link copied',
      'docs.noExampleBody': '(empty body)',
      'docs.copyLink': 'Copy link',
      'docs.copied': 'Link copied',
      'docs.flows': 'Linked flows',
      'docs.runs': 'Recent runs',
      'docs.noLinks': 'No linked flows or runs.',
      'nav.search': 'Search definitions',
      'collection.title': 'Collections',
      'collection.requests': 'Requests',
      'collection.flows': 'Flows',
      'collection.root': 'Root',
      'collection.search': 'Filter requests',
      'collection.toggle': 'Toggle collections',
      'collection.empty': 'No requests in this collection',
      'collection.flowEmpty': 'No flows in this collection',
      'request.folder': 'Folder',
      'flow.folder': 'Folder',
      'run.schema': 'Schema',
      'run.schemaEmpty': 'No JSON response',
      'common.closeTab': 'Close tab',
      'common.discardChanges': 'Discard unsaved changes?',
      'common.save': 'Save',
      'common.saving': 'Saving…',
      'common.saved': 'Saved',
      'common.delete': 'Delete',
      'common.cancel': 'Cancel',
      'common.confirm': 'Confirm',
      'common.refresh': 'Refresh',
      'common.add': 'Add',
      'common.remove': 'Remove',
      'common.run': 'Run',
      'common.running': 'Running…',
      'common.close': 'Close',
      'common.apply': 'Apply',
      'common.format': 'Format',
      'common.copy': 'Copy',
      'common.copied': 'Copied',
      'common.loading': 'Loading…',
      'common.name': 'Name',
      'common.description': 'Description',
      'common.enabled': 'On',
      'common.none': 'None',
      'common.optional': 'Optional',
      'common.open': 'Open',
      'common.back': 'Back',
      'common.error': 'Error',
      'common.warning': 'Warning',
      'request.new': 'New request',
      'request.name': 'Request name',
      'request.duplicate': 'Duplicate request',
      'request.url': 'Request URL',
      'request.urlPlaceholder': 'https://api.example.com/users/{{userId}}',
      'request.send': 'Send',
      'request.method': 'Method',
      'request.params': 'Params',
      'request.headers': 'Headers',
      'request.cookies': 'Cookies',
      'request.body': 'Body',
      'request.auth': 'Auth',
      'request.tests': 'Tests',
      'request.mock': 'Mock',
      'request.scripts': 'Scripts',
      'request.cases': 'Cases',
      'cases.title': 'Request cases',
      'cases.new': 'New case',
      'cases.empty': 'No cases yet. Add a case to run the same endpoint with different data.',
      'cases.name': 'Case name',
      'cases.overrides': 'Case overrides (JSON)',
      'cases.hint': 'Overrides can include query, headers, body, auth, tests, preScript, postScript, and variables.',
      'cases.run': 'Run case',
      'cases.save': 'Save cases',
      'cases.delete': 'Delete case',
      'cases.duplicate': 'Duplicate case',
      'inspect.title': 'Variable resolution',
      'inspect.request': 'Request',
      'inspect.environment': 'Environment',
      'inspect.global': 'Global',
      'inspect.missing': 'Missing',
      'inspect.none': 'No {{variables}} found in this request.',
      'inspect.overrides': 'overrides lower layer',
      'relations.title': 'Request relations',
      'relations.cases': 'Cases',
      'relations.flows': 'Linked flows',
      'relations.runs': 'Recent runs',
      'relations.history': 'History versions',
      'relations.empty': 'No cases, flows, runs, or history yet.',
      'relations.openHistory': 'Open history',
      'relations.zoomIn': 'Zoom in',
      'relations.zoomOut': 'Zoom out',
      'relations.resetZoom': 'Reset zoom',
      'relations.layoutRadial': 'Radial layout',
      'relations.layoutTree': 'Tree layout',
      'history.title': 'Request history',
      'history.empty': 'No saved revisions yet. Saving a request creates a revision.',
      'history.restore': 'Restore',
      'history.restored': 'Revision restored',
      'request.preScript': 'Pre-request script',
      'request.postScript': 'Post-request script',
      'request.scriptHint': 'Use pm.variables.set(name, value) to share values. Post scripts can inspect response and call pm.test(name, fn).',
      'mock.enabled': 'Enable mock endpoint',
      'mock.smart': 'Smart mock',
      'mock.smartHint': 'When the body is empty and smart mock is on, generate random JSON from the mock schema, first example, or request body.',
      'mock.schema': 'Mock JSON Schema',
      'mock.path': 'Mock path',
      'mock.pathHint': 'Optional path alias, e.g. /users/:id or /users/*; path params are available as {{id}}.',
      'mock.copyPathUrl': 'Copy path URL',
      'mock.conditions': 'Path match conditions',
      'mock.conditionHint': 'Path-level mock only matches when all enabled query/header conditions match.',
      'mock.queryConditions': 'Query conditions',
      'mock.headerConditions': 'Header conditions',
      'mock.pathCopied': 'Path URL copied',
      'mock.useExample': 'Use this example',
      'mock.selectedExample': 'Selected',
      'mock.status': 'Status code',
      'mock.delay': 'Delay (ms)',
      'mock.headers': 'Response headers',
      'mock.body': 'Response body',
      'mock.copyUrl': 'Copy mock URL',
      'mock.copied': 'Copied',
      'mock.hint': 'The mock URL serves this response locally; save the request first.',
      'mock.bodyHint': 'JSON or text response returned by the mock endpoint.',
      'mock.examples': 'Saved examples',
      'mock.saveExample': 'Save response as example',
      'mock.exampleSaved': 'Response saved as mock example',
      'mock.exampleHint': 'When the mock body is empty, the first saved example is returned (status and headers included).',
      'mock.noExamples': 'No saved examples',
      'request.timeout': 'Timeout (ms)',
      'request.followRedirects': 'Follow redirects',
      'request.bodyType': 'Body type',
      'request.bodyNone': 'None',
      'request.bodyJson': 'JSON',
      'request.bodyText': 'Text',
      'request.bodyForm': 'Form URL encoded',
      'request.bodyMultipart': 'Multipart form data',
      'request.addField': 'Add field',
      'request.addFile': 'Add file',
      'request.chooseFile': 'Choose file',
      'request.noFile': 'No file selected',
      'request.fileTooLarge': 'File exceeds 5MB limit',
      'request.formFields': 'Form fields',
      'request.addHeader': 'Add header',
      'request.addParam': 'Add param',
      'request.authType': 'Auth type',
      'request.authNone': 'No auth',
      'request.authBearer': 'Bearer token',
      'request.authBasic': 'Basic auth',
      'request.authApiKey': 'API key',
      'request.authOAuth2': 'OAuth 2.0',
      'request.authDigest': 'Digest Auth',
      'request.authOAuth1': 'OAuth 1.0',
      'request.authHawk': 'Hawk',
      'request.authAws': 'AWS Signature v4',
      'request.awsAccessKey': 'Access key',
      'request.awsSecretKey': 'Secret key',
      'request.awsRegion': 'Region',
      'request.awsService': 'Service',
      'request.awsSessionToken': 'Session token',
      'request.hawkId': 'Hawk ID',
      'request.hawkKey': 'Hawk key',
      'request.hawkAlgorithm': 'Algorithm',
      'request.hawkExt': 'Ext',
      'request.hawkPayloadHash': 'Include payload hash',
      'request.oauthConsumerKey': 'Consumer key',
      'request.oauthConsumerSecret': 'Consumer secret',
      'request.oauthToken': 'Token',
      'request.oauthTokenSecret': 'Token secret',
      'request.oauthSignatureMethod': 'Signature method',
      'request.oauthRealm': 'Realm',
      'request.oauthTokenUrl': 'Token URL',
      'request.oauthClientId': 'Client ID',
      'request.oauthClientSecret': 'Client secret',
      'request.oauthScope': 'Scope',
      'request.oauthClientAuth': 'Client credentials in',
      'request.token': 'Token',
      'request.username': 'Username',
      'request.password': 'Password',
      'request.key': 'Key',
      'request.value': 'Value',
      'request.in': 'In',
      'request.header': 'Header',
      'request.query': 'Query',
      'request.addTest': 'Add assertion',
      'request.testName': 'Assertion name',
      'request.testType': 'Type',
      'request.status': 'Status',
      'request.jsonPath': 'JSON path',
      'request.headerName': 'Header',
      'request.expected': 'Expected',
      'request.operator': 'Operator',
      'request.script': 'Script',
      'request.schema': 'JSON Schema',
      'request.scriptPlaceholder': 'return response.status === 200 && json.ok === true',
      'request.advanced': 'Edit assertions as JSON',
      'request.advancedHint': 'Array of assertion objects. Apply replaces the structured list.',
      'request.newName': 'Untitled request',
      'request.unsaved': 'Unsaved changes',
      'request.deleteConfirm': 'Delete this request? Flows that use it will be listed.',
      'flow.new': 'New flow',
      'flow.name': 'Flow name',
      'flow.description': 'What business scenario does this flow verify?',
      'flow.stopOnFailure': 'Stop after a failed step',
      'flow.variables': 'Flow variables',
      'flow.steps': 'Steps',
      'flow.addStep': 'Add step',
      'flow.stepName': 'Step name',
      'flow.selectRequest': 'Select a request',
      'flow.extract': 'Extract variables',
      'flow.addExtract': 'Add extraction',
      'flow.from': 'From',
      'flow.path': 'Path / header / regex',
      'flow.continueOnFailure': 'Continue on failure',
      'flow.condition': 'Run condition',
      'flow.delayMs': 'Delay (ms)',
      'flow.dataset': 'Dataset',
      'flow.datasetHint': 'JSON array; each object is one run and its keys become variables.',
      'flow.runDataset': 'Run dataset',
      'flow.overrides': 'Step overrides (JSON)',
      'flow.run': 'Run flow',
      'flow.save': 'Save flow',
      'flow.newName': 'Untitled flow',
      'flow.stepCount': '{count} steps',
      'flow.noRequests': 'Create at least one request before building a flow.',
      'flow.deleteConfirm': 'Delete this flow?',
      'flow.extracted': 'Extracted',
      'run.empty': 'No runs yet',
      'run.emptyHint': 'Send a request or run a flow. Every run is saved under .api-studio/runs.',
      'run.detail': 'Run detail',
      'run.passed': 'Passed',
      'run.skipped': 'Skipped',
      'run.skippedHint': 'The run condition was false, so this step was skipped.',
      'run.failed': 'Failed',
      'run.duration': 'Duration',
      'run.status': 'Status',
      'run.assertions': 'Assertions',
      'run.request': 'Request',
      'run.response': 'Response',
      'run.body': 'Body',
      'run.headers': 'Headers',
      'run.cookies': 'Cookies',
      'run.applyCookies': 'Apply to request',
      'run.pretty': 'Pretty',
      'run.raw': 'Raw',
      'run.jsonPath': 'JSONPath',
      'run.pathEmpty': 'No value at this path',
      'run.copyBody': 'Copy body',
      'run.downloadBody': 'Download body',
      'run.copyCurl': 'Copy as cURL',
      'run.codeSnippet': 'Code snippet',
      'run.fetch': 'fetch',
      'run.axios': 'axios',
      'run.codeCopied': 'Code copied',
      'run.resolveVariables': 'Resolve {{variables}}',
      'run.downloadSnippet': 'Download snippet',
      'run.curlCopied': 'cURL copied',
      'run.copied': 'Copied',
      'run.tests': 'Assertions',
      'run.steps': 'Steps',
      'run.executed': 'Executed',
      'run.passedSteps': 'Passed steps',
      'run.failedSteps': 'Failed steps',
      'run.avgLatency': 'Avg latency',
      'run.maxLatency': 'Max latency',
      'run.variables': 'Variables after run',
      'run.kindRequest': 'Single request',
      'run.kindFlow': 'Business flow',
      'run.open': 'Open run',
      'run.noResponse': 'No response',
      'run.emptyResponse': 'Send the request to see status, headers, body, and assertion results.',
      'report.empty': 'No reports yet',
      'report.emptyHint': 'Run a request or flow, then open a run to inspect it.',
      'report.open': 'Open report',
      'report.deleteConfirm': 'Delete this report?',
      'report.generated': 'AI report',
      'report.fallback': 'Rule-based report',
      'report.noRun': 'Select a run first',
      'vars.title': 'Workspace variables',
      'vars.short': 'Variables',
      'vars.hint': 'Available to every request and flow as {{name}}. Values are stored in .api-studio/workspace.json.',
      'vars.save': 'Save variables',
      'vars.invalid': 'Variables must be a JSON object with string, number, or boolean values.',
      'toast.requestSaved': 'Request saved',
      'toast.requestDeleted': 'Request deleted',
      'toast.flowSaved': 'Flow saved',
      'toast.flowDeleted': 'Flow deleted',
      'toast.variablesSaved': 'Variables saved',
      'toast.reportDeleted': 'Report deleted',
      'toast.runDone': 'Run completed',
      'toast.cookiesApplied': 'Response cookies added to the request',
      'toast.copyFailed': 'Copy failed',
      'empty.requests': 'No requests yet. Create one, or ask AI for a test.',
      'empty.flows': 'No flows yet. Chain saved requests into a business scenario.',
      'empty.reports': 'No reports yet.',
      'empty.runs': 'No runs yet.',
      'empty.search': 'No matches.',
      'errors.deleteReferenced': 'This request is referenced by flows. Confirm to delete it anyway.',
      'status.error': 'Request failed',
      'status.noTests': 'No assertions',
      'status.warnings': 'Warnings',
      'status.truncated': 'Response body truncated',
      'raw.actions': 'Actions',
      'report.createdAt': 'Created',
      'report.run': 'Run',
      'report.aiBadge': 'AI',
      'report.ruleBadge': 'Rule',
    }

    const zh = {
      'panel.title': '接口测试',
      'panel.subtitle': 'AirPost · 接口、流程与 AI 测试报告',
      'right.selectRequest': '选择接口',
      'right.selectFlow': '选择流程',
      'right.selectRun': '选择运行记录',
      'right.selectReport': '选择报告',
      'project.title': '项目设置',
      'project.env': '环境',
      'project.transfer': '导入 / 导出',
      'project.active': '当前环境',
      'project.newEnv': '新建环境',
      'project.duplicateEnv': '复制环境',
      'project.deleteEnv': '删除环境',
      'project.envName': '环境名称',
      'project.envVars': '环境变量',
      'project.envSearch': '搜索变量',
      'project.addEnvVar': '添加变量',
      'project.globalSearch': '搜索全局变量',
      'project.addGlobalVar': '添加全局变量',
      'project.bulkPaste': '批量粘贴',
      'project.bulkHint': '每行一个 key=value，已有键会被覆盖。',
      'project.bulkApply': '应用变量',
      'project.bulkPreview': '{count} 个变量 · {invalid} 行无效',
      'project.globalVars': '全局变量',
      'project.globalHeaders': '全局请求头（JSON 数组）',
      'project.globalQuery': '全局 Query（JSON 数组）',
      'project.save': '保存项目设置',
      'project.saved': '项目设置已保存',
      'project.import': '导入',
      'project.export': '导出',
      'project.action': '操作',
      'project.source': '来源',
      'project.target': '目标',
      'project.input': '内容',
      'project.output': '输出',
      'project.copy': '复制',
      'project.download': '下载',
      'project.imported': '已导入 {count} 个接口',
      'project.exported': '导出已生成',
      'project.importHint': '粘贴 cURL、OpenAPI/Swagger JSON 或 YAML、Postman Collection JSON、HAR JSON、Insomnia JSON、YApi JSON，或 AirPost Workspace JSON。',
      'project.mergeStrategy': '环境导入合并策略',
      'project.merge': '合并',
      'project.replace': '覆盖',
      'project.importPreview': '导入预览',
      'project.previewNew': '新增',
      'project.previewUpdated': '更新',
      'project.previewSame': '不变',
      'project.previewSummary': '新增 {newCount} · 更新 {updatedCount} · 不变 {sameCount}',
      'project.exportHint': '导出全部接口为 OpenAPI/Postman，或导出当前接口为 cURL。',
      'project.copyDone': '已复制',
      'project.noRequests': '没有可导出的接口。',
      'run.all': '运行全部',
      'run.trend': '最近运行趋势',
      'run.last12': '最近 12 次',
      'run.last24': '最近 24 次',
      'run.allRuns': '全部',
      'run.avg': '平均',
      'run.testMeter': '断言通过率',
      'run.compare': '对比',
      'run.comparePrevious': '与上一次运行对比',
      'run.noPrevious': '当前接口没有上一次运行',
      'run.compareBodies': '响应体差异',
      'run.previous': '上一次',
      'run.current': '当前',
      'run.noDiff': '响应体没有差异',
      'run.copyDiff': '复制差异',
      'run.diffCopied': '差异已复制',
      'run.onlyChanged': '仅显示变化行',
      'run.foldSame': '折叠未变化行',
      'run.unchangedLines': '行未变化',
      'run.collapseAll': '全部收起',
      'run.headerDiff': '响应头差异',
      'run.range7': '最近 7 天',
      'run.range30': '最近 30 天',
      'run.rangeAll': '全部时间',
      'run.noRuns': '该范围内没有运行',
      'run.unified': '统一视图',
      'run.split': '并排视图',
      'run.activeEnvironment': '当前环境',
      'run.environment': '运行环境',
      'run.matrix': '环境矩阵',
      'run.matrixTitle': '多环境运行矩阵',
      'run.matrixHint': '将单个接口或全部接口在多个环境中运行。',
      'run.matrixEnvironments': '环境',
      'run.matrixRequest': '接口',
      'run.matrixAllRequests': '全部接口',
      'run.matrixIncludeFlows': '包含流程',
      'run.matrixRun': '运行矩阵',
      'run.matrixEmpty': '还没有矩阵结果。',
      'run.matrixDone': '矩阵运行完成',
      'run.selfTest': '自检',
      'run.selfTestSummary': '通过 {passed} · 失败 {failed}',
      'run.check': '检查项',
      'run.matrixGrouped': '分组',
      'run.matrixTable': '矩阵表',
      'run.matrixRequestCol': '接口',
      'run.matrixCopy': '复制矩阵 (TSV)',
      'run.matrixDownload': '下载矩阵 (TSV)',
      'run.matrixOnlyDiff': '仅显示差异',
      'run.matrixDiff': '差异',
      'run.matrixDiffReport': '下载差异报告',
      'run.matrixMarkdown': '下载 Markdown 报告',
      'run.matrixHtml': '下载 HTML 报告',
      'run.matrixSvg': '下载图表 SVG',
      'run.matrixPng': '下载图表 PNG',
      'run.matrixCopied': '矩阵已复制',
      'run.allDone': '批量完成：{passed} 通过 / {count} 个',
      'nav.requests': '接口',
      'nav.flows': '流程',
      'nav.runs': '运行',
      'nav.reports': '报告',
      'nav.docs': '文档',
      'docs.title': 'API 文档',
      'docs.search': '搜索接口文档',
      'docs.empty': '还没有接口定义。',
      'docs.open': '在接口编辑器中打开',
      'docs.noDescription': '暂无描述。',
      'docs.overview': '概览',
      'docs.body': '请求体',
      'docs.auth': '鉴权',
      'docs.cases': '用例',
      'docs.examples': '响应示例',
      'docs.copyExample': '复制示例响应体',
      'docs.exampleHeaders': '响应头',
      'docs.showHeaders': '显示响应头',
      'docs.hideHeaders': '隐藏响应头',
      'docs.exampleCopied': '示例已复制',
      'docs.copyExampleLink': '复制示例章节链接',
      'docs.downloadExample': '下载独立 HTML',
      'docs.exampleLinkCopied': '示例链接已复制',
      'docs.noExampleBody': '(空响应体)',
      'docs.copyLink': '复制链接',
      'docs.copied': '链接已复制',
      'docs.flows': '关联流程',
      'docs.runs': '最近运行',
      'docs.noLinks': '暂无关联流程或运行。',
      'nav.search': '搜索接口或流程',
      'collection.title': '接口集合',
      'collection.requests': '接口',
      'collection.flows': '流程',
      'collection.root': '根目录',
      'collection.search': '筛选接口',
      'collection.toggle': '展开 / 收起集合',
      'collection.empty': '这个集合里还没有接口',
      'collection.flowEmpty': '这个集合里还没有流程',
      'request.folder': '集合',
      'flow.folder': '集合',
      'run.schema': '响应结构',
      'run.schemaEmpty': '没有 JSON 响应',
      'common.closeTab': '关闭标签页',
      'common.discardChanges': '放弃未保存的修改？',
      'common.save': '保存',
      'common.saving': '保存中…',
      'common.saved': '已保存',
      'common.delete': '删除',
      'common.cancel': '取消',
      'common.confirm': '确认',
      'common.refresh': '刷新',
      'common.add': '添加',
      'common.remove': '移除',
      'common.run': '运行',
      'common.running': '运行中…',
      'common.close': '关闭',
      'common.apply': '应用',
      'common.format': '格式化',
      'common.copy': '复制',
      'common.copied': '已复制',
      'common.loading': '加载中…',
      'common.name': '名称',
      'common.description': '描述',
      'common.enabled': '启用',
      'common.none': '无',
      'common.optional': '可选',
      'common.open': '打开',
      'common.back': '返回',
      'common.error': '错误',
      'common.warning': '提示',
      'request.new': '新建接口',
      'request.name': '接口名称',
      'request.duplicate': '复制接口',
      'request.url': '请求 URL',
      'request.urlPlaceholder': 'https://api.example.com/users/{{userId}}',
      'request.send': '发送',
      'request.method': '方法',
      'request.params': '参数',
      'request.headers': '请求头',
      'request.cookies': 'Cookie',
      'request.body': '请求体',
      'request.auth': '鉴权',
      'request.tests': '断言',
      'request.mock': 'Mock',
      'request.scripts': '脚本',
      'request.cases': '用例',
      'cases.title': '接口测试用例',
      'cases.new': '新建用例',
      'cases.empty': '还没有用例。可为同一接口保存不同数据的测试用例。',
      'cases.name': '用例名称',
      'cases.overrides': '用例覆盖 (JSON)',
      'cases.hint': '可覆盖 query、headers、body、auth、tests、preScript、postScript 和 variables。',
      'cases.run': '运行用例',
      'cases.save': '保存用例',
      'cases.delete': '删除用例',
      'cases.duplicate': '复制用例',
      'inspect.title': '变量解析',
      'inspect.request': '请求',
      'inspect.environment': '环境',
      'inspect.global': '全局',
      'inspect.missing': '未定义',
      'inspect.none': '当前请求没有使用 {{变量}}。',
      'inspect.overrides': '覆盖下层',
      'relations.title': '请求关联',
      'relations.cases': '用例',
      'relations.flows': '关联流程',
      'relations.runs': '最近运行',
      'relations.history': '历史版本',
      'relations.empty': '暂无用例、流程、运行或历史记录。',
      'relations.openHistory': '打开历史',
      'relations.zoomIn': '放大',
      'relations.zoomOut': '缩小',
      'relations.resetZoom': '重置缩放',
      'relations.layoutRadial': '放射布局',
      'relations.layoutTree': '树形布局',
      'history.title': '请求历史',
      'history.empty': '还没有历史版本。每次保存接口都会生成一个版本。',
      'history.restore': '恢复',
      'history.restored': '历史版本已恢复',
      'request.preScript': '前置脚本',
      'request.postScript': '后置脚本',
      'request.scriptHint': '使用 pm.variables.set(name, value) 共享变量；后置脚本可读取 response 并调用 pm.test(name, fn)。',
      'mock.enabled': '启用 Mock 接口',
      'mock.smart': '智能 Mock',
      'mock.smartHint': '响应体为空且开启智能 Mock 时，根据 Mock Schema、第一个示例或请求体 JSON 生成随机数据。',
      'mock.schema': 'Mock JSON Schema',
      'mock.path': 'Mock 路径',
      'mock.pathHint': '可选路径别名，例如 /users/:id 或 /users/*；路径参数可在响应中使用 {{id}}。',
      'mock.copyPathUrl': '复制路径 Mock 地址',
      'mock.conditions': '路径匹配条件',
      'mock.conditionHint': '路径级 Mock 仅在所有启用的 Query/Header 条件匹配时生效。',
      'mock.queryConditions': 'Query 条件',
      'mock.headerConditions': 'Header 条件',
      'mock.pathCopied': '路径地址已复制',
      'mock.useExample': '使用此示例',
      'mock.selectedExample': '当前使用',
      'mock.status': '状态码',
      'mock.delay': '延迟 (ms)',
      'mock.headers': '响应头',
      'mock.body': '响应体',
      'mock.copyUrl': '复制 Mock 地址',
      'mock.copied': '已复制',
      'mock.hint': 'Mock 地址在当前 Host 上返回这份响应；请先保存接口。',
      'mock.bodyHint': 'Mock 返回的 JSON 或文本内容。',
      'mock.examples': '已保存示例',
      'mock.saveExample': '保存响应为示例',
      'mock.exampleSaved': '响应已保存为 Mock 示例',
      'mock.exampleHint': 'Mock 响应体为空时，会返回第一个已保存示例的状态码、响应头和响应体。',
      'mock.noExamples': '还没有示例',
      'request.timeout': '超时 (ms)',
      'request.followRedirects': '跟随重定向',
      'request.bodyType': '请求体类型',
      'request.bodyNone': '无',
      'request.bodyJson': 'JSON',
      'request.bodyText': '文本',
      'request.bodyForm': 'Form 表单',
      'request.bodyMultipart': 'Multipart 表单',
      'request.addField': '添加字段',
      'request.addFile': '添加文件',
      'request.chooseFile': '选择文件',
      'request.noFile': '未选择文件',
      'request.fileTooLarge': '文件超过 5MB 限制',
      'request.formFields': '表单字段',
      'request.addHeader': '添加请求头',
      'request.addParam': '添加参数',
      'request.authType': '鉴权方式',
      'request.authNone': '无鉴权',
      'request.authBearer': 'Bearer Token',
      'request.authBasic': 'Basic Auth',
      'request.authApiKey': 'API Key',
      'request.authOAuth2': 'OAuth 2.0',
      'request.authDigest': 'Digest 认证',
      'request.authOAuth1': 'OAuth 1.0',
      'request.authHawk': 'Hawk',
      'request.authAws': 'AWS Signature v4',
      'request.awsAccessKey': 'Access Key',
      'request.awsSecretKey': 'Secret Key',
      'request.awsRegion': 'Region',
      'request.awsService': 'Service',
      'request.awsSessionToken': 'Session Token',
      'request.hawkId': 'Hawk ID',
      'request.hawkKey': 'Hawk Key',
      'request.hawkAlgorithm': '算法',
      'request.hawkExt': 'Ext',
      'request.hawkPayloadHash': '包含请求体哈希',
      'request.oauthConsumerKey': 'Consumer Key',
      'request.oauthConsumerSecret': 'Consumer Secret',
      'request.oauthToken': 'Token',
      'request.oauthTokenSecret': 'Token Secret',
      'request.oauthSignatureMethod': '签名方式',
      'request.oauthRealm': 'Realm',
      'request.oauthTokenUrl': 'Token 地址',
      'request.oauthClientId': 'Client ID',
      'request.oauthClientSecret': 'Client Secret',
      'request.oauthScope': 'Scope',
      'request.oauthClientAuth': '客户端凭证位置',
      'request.token': 'Token',
      'request.username': '用户名',
      'request.password': '密码',
      'request.key': 'Key',
      'request.value': 'Value',
      'request.in': '位置',
      'request.header': '请求头',
      'request.query': '查询参数',
      'request.addTest': '添加断言',
      'request.testName': '断言名称',
      'request.testType': '类型',
      'request.status': '状态码',
      'request.jsonPath': 'JSON 路径',
      'request.headerName': '响应头',
      'request.expected': '期望值',
      'request.operator': '操作符',
      'request.script': '脚本',
      'request.schema': 'JSON Schema',
      'request.scriptPlaceholder': 'return response.status === 200 && json.ok === true',
      'request.advanced': '以 JSON 编辑断言',
      'request.advancedHint': '断言对象数组；应用后会替换结构化列表。',
      'request.newName': '未命名接口',
      'request.unsaved': '有未保存修改',
      'request.deleteConfirm': '删除这个接口？如果流程引用它，会随后提示。',
      'flow.new': '新建流程',
      'flow.name': '流程名称',
      'flow.description': '这个流程验证什么业务场景？',
      'flow.stopOnFailure': '步骤失败后停止',
      'flow.variables': '流程变量',
      'flow.steps': '步骤',
      'flow.addStep': '添加步骤',
      'flow.stepName': '步骤名称',
      'flow.selectRequest': '选择接口',
      'flow.extract': '提取变量',
      'flow.addExtract': '添加提取',
      'flow.from': '来源',
      'flow.path': '路径 / 响应头 / 正则',
      'flow.continueOnFailure': '失败后继续',
      'flow.condition': '运行条件',
      'flow.delayMs': '等待 (ms)',
      'flow.dataset': '数据集',
      'flow.datasetHint': 'JSON 数组；每个对象运行一次，键会作为变量。',
      'flow.runDataset': '运行数据集',
      'flow.overrides': '步骤覆盖 (JSON)',
      'flow.run': '运行流程',
      'flow.save': '保存流程',
      'flow.newName': '未命名流程',
      'flow.stepCount': '{count} 个步骤',
      'flow.noRequests': '请先创建至少一个接口，才能编排流程。',
      'flow.deleteConfirm': '删除这个流程？',
      'flow.extracted': '已提取',
      'run.empty': '还没有运行记录',
      'run.emptyHint': '发送一次请求或运行一次流程；所有记录保存在 .api-studio/runs。',
      'run.detail': '运行详情',
      'run.passed': '通过',
      'run.skipped': '已跳过',
      'run.skippedHint': '运行条件不满足，本步骤已跳过。',
      'run.failed': '失败',
      'run.duration': '耗时',
      'run.status': '状态码',
      'run.assertions': '断言',
      'run.request': '请求',
      'run.response': '响应',
      'run.body': '响应体',
      'run.headers': '响应头',
      'run.cookies': 'Cookie',
      'run.applyCookies': '应用到请求',
      'run.pretty': '格式化',
      'run.raw': '原始',
      'run.jsonPath': 'JSONPath',
      'run.pathEmpty': '该路径没有值',
      'run.copyBody': '复制响应体',
      'run.downloadBody': '下载响应体',
      'run.copyCurl': '复制为 cURL',
      'run.codeSnippet': '代码片段',
      'run.fetch': 'fetch',
      'run.axios': 'axios',
      'run.codeCopied': '代码已复制',
      'run.resolveVariables': '解析 {{变量}}',
      'run.downloadSnippet': '下载代码片段',
      'run.curlCopied': 'cURL 已复制',
      'run.copied': '已复制',
      'run.tests': '断言',
      'run.steps': '步骤',
      'run.executed': '已执行',
      'run.passedSteps': '通过步骤',
      'run.failedSteps': '失败步骤',
      'run.avgLatency': '平均耗时',
      'run.maxLatency': '最大耗时',
      'run.variables': '运行后变量',
      'run.kindRequest': '单接口',
      'run.kindFlow': '业务流程',
      'run.open': '打开运行记录',
      'run.noResponse': '暂无响应',
      'run.emptyResponse': '发送请求后，这里显示状态码、响应头、响应体和断言结果。',
      'report.empty': '还没有报告',
      'report.emptyHint': '先运行接口或流程，再打开运行记录查看。',
      'report.open': '打开报告',
      'report.deleteConfirm': '删除这份报告？',
      'report.generated': 'AI 报告',
      'report.fallback': '规则报告',
      'report.noRun': '请先选择一次运行',
      'vars.title': '工作区变量',
      'vars.short': '变量',
      'vars.hint': '所有接口和流程都可以用 {{变量名}} 引用。变量保存在 .api-studio/workspace.json。',
      'vars.save': '保存变量',
      'vars.invalid': '变量必须是 JSON 对象，值只能是字符串、数字或布尔值。',
      'toast.requestSaved': '接口已保存',
      'toast.requestDeleted': '接口已删除',
      'toast.flowSaved': '流程已保存',
      'toast.flowDeleted': '流程已删除',
      'toast.variablesSaved': '变量已保存',
      'toast.reportDeleted': '报告已删除',
      'toast.runDone': '运行完成',
      'toast.cookiesApplied': '响应 Cookie 已加入请求',
      'toast.copyFailed': '复制失败',
      'empty.requests': '还没有接口。新建一个，或让 AI 生成。',
      'empty.flows': '还没有流程。把已保存的接口编排成业务流程。',
      'empty.reports': '还没有报告。',
      'empty.runs': '还没有运行记录。',
      'empty.search': '没有匹配项。',
      'errors.deleteReferenced': '该接口仍被流程引用，确认后会强制删除。',
      'status.error': '请求失败',
      'status.noTests': '没有断言',
      'status.warnings': '提示',
      'status.truncated': '响应体已截断',
      'raw.actions': '操作',
      'report.createdAt': '生成时间',
      'report.run': '运行',
      'report.aiBadge': 'AI',
      'report.ruleBadge': '规则',
    }

    const CSS = `
.aps-root{--aps-radius:9px;position:relative;display:flex;flex-direction:column;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-family:inherit;font-size:13px;line-height:1.5;box-sizing:border-box}
.aps-root *{box-sizing:border-box}
.aps-header{display:flex;align-items:center;gap:14px;min-height:54px;padding:0 16px;border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}
.aps-brand{display:flex;align-items:center;gap:9px;min-width:0}
.aps-brand-mark{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;background:color-mix(in srgb,#1f5a44 13%,transparent);color:#1f5a44;flex:0 0 auto}
.aps-brand-text{display:flex;flex-direction:column;min-width:0;line-height:1.25}
.aps-brand-title{font-size:14px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.aps-brand-sub{font-size:11px;color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.aps-header-spacer{flex:1}
.aps-header-meta{display:flex;align-items:center;gap:8px;min-width:0;color:var(--dsw-alias-label-secondary);font-size:11px}
.aps-root-badge{max-width:340px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:3px 8px;border-radius:999px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10.5px}
.aps-model-badge{max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:3px 8px;border-radius:999px;border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);font-size:10.5px}
.aps-model-badge.ok{color:var(--dsw-alias-state-success-primary);border-color:color-mix(in srgb,var(--dsw-alias-state-success-primary) 36%,var(--dsw-alias-border-l1))}
.aps-model-badge.bad{color:var(--dsw-alias-state-warn-primary);border-color:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 36%,var(--dsw-alias-border-l1))}
.aps-header-actions{display:flex;align-items:center;gap:6px}
.aps-btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;height:28px;padding:0 10px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;line-height:1;cursor:pointer;white-space:nowrap}
.aps-btn:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2)}
.aps-btn:disabled{opacity:.55;cursor:default}
.aps-btn.primary{background:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary);color:#fff;font-weight:600}
.aps-btn.primary:hover:not(:disabled){filter:brightness(1.05)}
.aps-btn.success{background:var(--dsw-alias-state-success-primary);border-color:var(--dsw-alias-state-success-primary);color:#fff;font-weight:600}
.aps-btn.ghost{border-color:transparent;background:transparent}
.aps-btn.ghost:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2)}
.aps-btn.danger{color:var(--dsw-alias-state-error-primary);border-color:color-mix(in srgb,var(--dsw-alias-state-error-primary) 38%,var(--dsw-alias-border-l1))}
.aps-btn.danger:hover:not(:disabled){background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 10%,transparent)}
.aps-btn.small{height:24px;padding:0 8px;font-size:11px}
.aps-button-danger{color:var(--dsw-alias-state-error-primary)}
.aps-button-success{color:var(--dsw-alias-state-success-primary)}
.aps-btn:focus-visible,.aps-icon-btn:focus-visible,.aps-input:focus-visible,.aps-select:focus-visible,.aps-textarea:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.aps-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;padding:0;border:1px solid transparent;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;flex:0 0 auto}
.aps-icon-btn:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.aps-icon-btn:disabled{opacity:.4;cursor:default}
.aps-body{display:flex;flex:1;min-height:0;min-width:0}
.aps-nav{display:flex;flex-direction:column;width:276px;min-width:220px;max-width:310px;border-right:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);min-height:0}
.aps-nav-tabs{display:flex;flex-wrap:wrap;gap:2px;padding:8px 8px 6px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.aps-nav-tab{display:inline-flex;align-items:center;gap:4px;height:27px;padding:0 8px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11.5px;cursor:pointer;white-space:nowrap}
.aps-nav-tab:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.aps-nav-tab.active{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 13%,transparent);color:var(--dsw-alias-brand-primary);font-weight:600}
.aps-nav-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 10px 7px}
.aps-nav-title{font-size:11px;font-weight:650;letter-spacing:.04em;text-transform:uppercase;color:var(--dsw-alias-label-secondary)}
.aps-search{margin:0 10px 8px;position:relative}
.aps-search input{width:100%;height:27px;padding:0 8px 0 25px;border:1px solid var(--dsw-alias-border-l1);border-radius:6px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:11.5px}
.aps-search svg{position:absolute;left:7px;top:6px;color:var(--dsw-alias-label-secondary)}
.aps-list{flex:1;min-height:0;overflow:auto;padding:0 6px 10px}
.aps-list-item{display:flex;flex-direction:column;gap:3px;width:100%;padding:8px 8px;margin:1px 0;border:1px solid transparent;border-radius:7px;background:transparent;color:inherit;text-align:left;cursor:pointer;font:inherit}
.aps-list-item:hover{background:var(--dsw-alias-bg-layer-2)}
.aps-list-item.active{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 11%,transparent);border-color:color-mix(in srgb,var(--dsw-alias-brand-primary) 25%,transparent)}
.aps-list-row{display:flex;align-items:center;gap:6px;min-width:0}
.aps-list-name{font-size:12px;font-weight:550;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0}
.aps-list-sub{font-size:10.5px;color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.aps-method{display:inline-flex;align-items:center;justify-content:center;min-width:38px;height:18px;padding:0 5px;border-radius:4px;font-size:9.5px;font-weight:750;letter-spacing:.02em;flex:0 0 auto}
.aps-method.GET{color:var(--dsw-alias-brand-primary);background:color-mix(in srgb,var(--dsw-alias-brand-primary) 13%,transparent)}
.aps-method.POST{color:var(--dsw-alias-state-success-primary);background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 13%,transparent)}
.aps-method.PUT,.aps-method.PATCH{color:var(--dsw-alias-state-warn-primary);background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 14%,transparent)}
.aps-method.DELETE{color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 12%,transparent)}
.aps-method.HEAD,.aps-method.OPTIONS{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2)}
.aps-pill{display:inline-flex;align-items:center;gap:4px;height:18px;padding:0 6px;border-radius:999px;font-size:10px;font-weight:550;flex:0 0 auto}
.aps-pill.ok{color:var(--dsw-alias-state-success-primary);background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 12%,transparent)}
.aps-pill.bad{color:var(--dsw-alias-state-error-primary);background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 11%,transparent)}
.aps-pill.neutral{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2)}
.aps-nav-empty{padding:18px 14px;color:var(--dsw-alias-label-secondary);font-size:11.5px;line-height:1.65}
.aps-main{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;padding:10px 12px 12px;gap:10px;overflow:hidden}
.aps-card{border:1px solid var(--dsw-alias-border-l1);border-radius:var(--aps-radius);background:var(--dsw-alias-bg-layer-1);min-width:0}
.aps-workbench{display:flex;flex-direction:column;gap:10px;height:100%;min-height:0}
.aps-editor-card{display:flex;flex-direction:column;min-height:0;flex:1;overflow:hidden}
.aps-request-head{padding:10px 12px 9px;border-bottom:1px solid var(--dsw-alias-border-l1);display:flex;flex-direction:column;gap:7px}
.aps-name-row{display:flex;align-items:center;gap:8px;min-width:0}
.aps-name-input{flex:1;min-width:0;border:0;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:15px;font-weight:650;padding:2px 0}
.aps-name-input:focus{outline:none}
.aps-dirty{font-size:10.5px;color:var(--dsw-alias-state-warn-primary);white-space:nowrap}
.aps-url-row{display:flex;align-items:center;gap:6px;min-width:0}
.aps-select{height:30px;padding:0 7px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;min-width:0}
.aps-select.method{width:92px;font-weight:650}
.aps-input{height:30px;padding:0 9px;border:1px solid var(--dsw-alias-border-l1);border-radius:6px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;min-width:0}
.aps-input.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px}
.aps-input.url{flex:1;min-width:0}
.aps-input.small{height:26px;font-size:11.5px}
.aps-textarea{width:100%;min-height:70px;padding:8px 9px;border:1px solid var(--dsw-alias-border-l1);border-radius:6px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;line-height:1.55;resize:vertical;min-width:0}
.aps-textarea.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px;line-height:1.55}
.aps-textarea.tall{min-height:170px}
.aps-meta-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;color:var(--dsw-alias-label-secondary);font-size:11px}
.aps-checkbox{display:inline-flex;align-items:center;gap:5px;cursor:pointer;user-select:none;color:var(--dsw-alias-label-secondary);font-size:11.5px;white-space:nowrap}
.aps-checkbox input{accent-color:var(--dsw-alias-brand-primary);margin:0}
.aps-tabs{display:flex;align-items:center;gap:1px;padding:0 10px;border-bottom:1px solid var(--dsw-alias-border-l1);min-height:35px;overflow:auto}
.aps-tab{height:34px;padding:0 9px;border:0;border-bottom:2px solid transparent;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11.5px;cursor:pointer;white-space:nowrap}
.aps-tab:hover{color:var(--dsw-alias-label-primary)}
.aps-tab.active{color:var(--dsw-alias-brand-primary);border-bottom-color:var(--dsw-alias-brand-primary);font-weight:600}
.aps-tab-spacer{flex:1}
.aps-tab-body{flex:1;min-height:0;overflow:auto;padding:10px 12px 14px}
.aps-field{display:flex;flex-direction:column;gap:4px;min-width:0}
.aps-field-label{font-size:10.5px;font-weight:600;color:var(--dsw-alias-label-secondary);letter-spacing:.02em}
.aps-field-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.aps-form-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px}
.aps-section-title{display:flex;align-items:center;gap:7px;margin:0 0 8px;font-size:11px;font-weight:650;color:var(--dsw-alias-label-secondary);text-transform:uppercase;letter-spacing:.04em}
.aps-table{width:100%;border-collapse:collapse;table-layout:fixed}
.aps-table th{text-align:left;font-size:10px;font-weight:600;color:var(--dsw-alias-label-secondary);padding:0 4px 5px;text-transform:uppercase;letter-spacing:.04em}
.aps-table td{padding:3px 4px;vertical-align:middle}
.aps-table .aps-col-on{width:34px}
.aps-table .aps-col-x{width:30px}
.aps-tiny-input{width:100%;height:27px;padding:0 7px;border:1px solid var(--dsw-alias-border-l1);border-radius:5px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:11.5px;min-width:0}
.aps-tiny-input.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px}
.aps-row-actions{display:flex;align-items:center;gap:4px}
.aps-test-card{border:1px solid var(--dsw-alias-border-l1);border-radius:7px;background:var(--dsw-alias-bg-base);padding:8px;margin-bottom:7px}
.aps-test-head{display:flex;align-items:center;gap:6px;margin-bottom:6px}
.aps-test-index{display:inline-flex;align-items:center;justify-content:center;width:19px;height:19px;border-radius:50%;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:10px;font-weight:650;flex:0 0 auto}
.aps-test-grid{display:grid;grid-template-columns:1.1fr .7fr 1.4fr 1.1fr;gap:6px}
.aps-test-grid.script{grid-template-columns:1fr}
.aps-assert-result{display:flex;align-items:flex-start;gap:7px;padding:6px 8px;border-radius:6px;margin-bottom:5px;font-size:11.5px;line-height:1.45;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l1)}
.aps-assert-result.pass{border-left:3px solid var(--dsw-alias-state-success-primary)}
.aps-assert-result.fail{border-left:3px solid var(--dsw-alias-state-error-primary)}
.aps-assert-name{font-weight:600;min-width:120px}
.aps-assert-msg{color:var(--dsw-alias-label-secondary);overflow-wrap:anywhere}
.aps-response-card{display:flex;flex-direction:column;min-height:190px;height:42%;overflow:hidden}
.aps-response-head{display:flex;align-items:center;gap:8px;padding:7px 11px;border-bottom:1px solid var(--dsw-alias-border-l1);min-height:36px;flex-wrap:wrap}
.aps-response-title{font-size:11px;font-weight:650;letter-spacing:.04em;text-transform:uppercase;color:var(--dsw-alias-label-secondary)}
.aps-response-meta{display:flex;align-items:center;gap:8px;font-size:10.5px;color:var(--dsw-alias-label-secondary);min-width:0;overflow:hidden}
.aps-code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px;line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere;margin:0;color:var(--dsw-alias-label-primary)}
.aps-code-wrap{overflow:auto;max-height:100%;padding:9px 11px;background:var(--dsw-alias-bg-base);border-radius:0 0 var(--aps-radius) var(--aps-radius)}
.aps-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;height:100%;min-height:120px;padding:24px;text-align:center;color:var(--dsw-alias-label-secondary)}
.aps-empty-title{font-size:12.5px;font-weight:600;color:var(--dsw-alias-label-primary)}
.aps-empty-hint{max-width:460px;font-size:11.5px;line-height:1.6}
.aps-flow-wrap{height:100%;min-height:0;display:flex;flex-direction:column;gap:10px;overflow:auto}
.aps-flow-head{display:flex;flex-direction:column;gap:8px;padding:11px 12px}
.aps-flow-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.aps-steps{display:flex;flex-direction:column;gap:8px;padding:0 12px 12px}
.aps-step{position:relative;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-base);padding:9px 10px 10px 12px}
.aps-step::before{content:'';position:absolute;left:0;top:9px;bottom:9px;width:3px;border-radius:0 3px 3px 0;background:color-mix(in srgb,var(--dsw-alias-brand-primary) 55%,transparent)}
.aps-step-head{display:flex;align-items:center;gap:6px;min-width:0;margin-bottom:7px}
.aps-step-num{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:color-mix(in srgb,var(--dsw-alias-brand-primary) 12%,transparent);color:var(--dsw-alias-brand-primary);font-size:10px;font-weight:700;flex:0 0 auto}
.aps-step-name{flex:1;min-width:0;height:27px;padding:0 7px;border:1px solid transparent;border-radius:5px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;font-weight:600}
.aps-step-name:hover,.aps-step-name:focus{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-border-l1);outline:none}
.aps-step-grid{display:grid;grid-template-columns:minmax(180px,1.2fr) minmax(180px,1fr);gap:8px}
.aps-extract-row{display:flex;align-items:center;gap:5px;margin-top:5px}
.aps-extract-row .aps-tiny-input:nth-child(1){flex:1.1}
.aps-extract-row .aps-tiny-input:nth-child(2){flex:.7}
.aps-extract-row .aps-tiny-input:nth-child(3){flex:1.4}
.aps-details{margin-top:7px;border-top:1px dashed var(--dsw-alias-border-l1);padding-top:7px}
.aps-details summary{cursor:pointer;color:var(--dsw-alias-label-secondary);font-size:11px;user-select:none}
.aps-run-wrap{height:100%;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:10px}
.aps-run-head{display:flex;align-items:center;gap:9px;padding:11px 12px;flex-wrap:wrap;border-bottom:1px solid var(--dsw-alias-border-l1)}
.aps-run-title{font-size:14px;font-weight:650;min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.aps-stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(112px,1fr));gap:1px;background:var(--dsw-alias-border-l1);border:1px solid var(--dsw-alias-border-l1);border-radius:7px;overflow:hidden}
.aps-stat{background:var(--dsw-alias-bg-base);padding:8px 10px;display:flex;flex-direction:column;gap:2px;min-width:0}
.aps-stat-value{font-size:15px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.aps-stat-label{font-size:10px;color:var(--dsw-alias-label-secondary);text-transform:uppercase;letter-spacing:.04em}
.aps-step-result{border:1px solid var(--dsw-alias-border-l1);border-radius:7px;background:var(--dsw-alias-bg-base);margin-bottom:7px;overflow:hidden}
.aps-step-result summary{display:flex;align-items:center;gap:8px;padding:7px 9px;cursor:pointer;list-style:none}
.aps-step-result summary::-webkit-details-marker{display:none}
.aps-step-result-body{padding:0 9px 9px;border-top:1px solid var(--dsw-alias-border-l1)}
.aps-subhead{display:flex;align-items:center;gap:6px;font-size:10.5px;font-weight:650;color:var(--dsw-alias-label-secondary);text-transform:uppercase;letter-spacing:.04em;margin:9px 0 5px}
.aps-report{height:100%;min-height:0;display:flex;flex-direction:column;overflow:hidden}
.aps-report-head{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--dsw-alias-border-l1);flex-wrap:wrap}
.aps-report-title{font-size:14px;font-weight:650;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.aps-report-body{flex:1;min-height:0;overflow:auto;padding:14px 16px}
.aps-report-text{white-space:pre-wrap;overflow-wrap:anywhere;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px;line-height:1.65;margin:0;color:var(--dsw-alias-label-primary)}
.aps-notice{padding:7px 9px;border-radius:6px;font-size:11.5px;line-height:1.55;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base)}
.aps-notice.bad{color:var(--dsw-alias-state-error-primary);border-color:color-mix(in srgb,var(--dsw-alias-state-error-primary) 36%,var(--dsw-alias-border-l1));background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 7%,var(--dsw-alias-bg-base))}
.aps-notice.warn{color:var(--dsw-alias-state-warn-primary);border-color:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 34%,var(--dsw-alias-border-l1));background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 7%,var(--dsw-alias-bg-base))}
.aps-toast{position:fixed;right:22px;bottom:22px;z-index:12000;max-width:min(420px,calc(100vw - 44px));padding:9px 13px;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 14px 42px color-mix(in srgb,var(--dsw-alias-label-primary) 24%,transparent);font-size:12px;line-height:1.5}
.aps-toast.bad{color:var(--dsw-alias-state-error-primary);border-color:color-mix(in srgb,var(--dsw-alias-state-error-primary) 40%,var(--dsw-alias-border-l1))}
.aps-modal-backdrop{position:fixed;inset:0;z-index:11000;display:flex;align-items:center;justify-content:center;padding:24px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 34%,transparent)}
.aps-modal{width:min(620px,100%);max-height:min(78vh,760px);display:flex;flex-direction:column;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 22px 64px color-mix(in srgb,var(--dsw-alias-label-primary) 28%,transparent);overflow:hidden}
.aps-modal-head{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.aps-modal-title{font-size:13px;font-weight:650;flex:1}
.aps-modal-body{padding:13px 14px;overflow:auto;display:flex;flex-direction:column;gap:8px}
.aps-modal-foot{display:flex;align-items:center;justify-content:flex-end;gap:7px;padding:10px 14px;border-top:1px solid var(--dsw-alias-border-l1)}
.aps-spin{width:13px;height:13px;border:2px solid color-mix(in srgb,currentColor 30%,transparent);border-top-color:currentColor;border-radius:50%;animation:aps-spin .7s linear infinite;flex:0 0 auto}
@keyframes aps-spin{to{transform:rotate(360deg)}}
.aps-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.aps-muted{color:var(--dsw-alias-label-secondary)}
.aps-scroll-x{overflow:auto}
.aps-root.aps-right-root{height:100%;min-height:0}
.aps-root.aps-right-root .aps-header{min-height:42px;padding:4px 8px;gap:6px;flex-wrap:wrap;row-gap:2px}
.aps-root.aps-right-root .aps-brand{flex:1 1 120px;min-width:0}
.aps-root.aps-right-root .aps-header-spacer{display:none}
.aps-root.aps-right-root .aps-brand-mark{width:22px;height:22px;border-radius:6px}
.aps-root.aps-right-root .aps-brand-title{font-size:12.5px}
.aps-root.aps-right-root .aps-brand-sub{display:none}
.aps-root.aps-right-root .aps-header-meta{gap:4px;min-width:0}
.aps-root.aps-right-root .aps-root-badge{display:none}
.aps-root.aps-right-root .aps-model-badge{max-width:112px;font-size:9.5px;padding:2px 6px}
.aps-root.aps-right-root .aps-header-actions{gap:2px}
.aps-root.aps-right-root .aps-btn.small{height:23px;padding:0 6px;font-size:10.5px}
.aps-right-main{display:flex;flex-direction:column;flex:1;min-height:0;min-width:0}
.aps-right-tabs{display:flex;align-items:center;gap:1px;padding:4px 6px;border-bottom:1px solid var(--dsw-alias-border-l1);overflow-x:auto;flex:0 0 auto;scrollbar-width:thin}
.aps-right-tabs .aps-nav-tab{height:25px;padding:0 7px;font-size:10.5px}
.aps-right-toolbar{display:flex;align-items:center;gap:5px;padding:5px 6px;border-bottom:1px solid var(--dsw-alias-border-l1);flex:0 0 auto;min-width:0}
.aps-right-select{flex:1;min-width:0;height:26px;font-size:11px}
.aps-right-body{flex:1;min-height:0;display:flex;flex-direction:column;padding:6px;overflow:hidden}
.aps-right-body > *{min-height:0}
.aps-right-request{display:flex;flex-direction:column;gap:6px;height:100%;min-height:0;padding:6px;box-sizing:border-box}
.aps-right-request .aps-editor-card{flex:1;min-height:0}
.aps-right-request .aps-response-card{height:45%;min-height:170px;flex:0 0 auto}
.aps-root.aps-right-root .aps-request-head{padding:7px 8px 6px;gap:5px}
.aps-root.aps-right-root .aps-name-input{font-size:13px}
.aps-root.aps-right-root .aps-name-row{flex-wrap:wrap}
.aps-root.aps-right-root .aps-url-row{flex-wrap:wrap}
.aps-root.aps-right-root .aps-url-row .aps-input.url{min-width:120px}
.aps-root.aps-right-root .aps-select.method{width:80px;height:27px;font-size:11px}
.aps-root.aps-right-root .aps-input{height:27px;font-size:11px}
.aps-root.aps-right-root .aps-btn{height:26px;font-size:11px;padding:0 8px}
.aps-root.aps-right-root .aps-tab-body{padding:7px 8px 10px}
.aps-root.aps-right-root .aps-test-grid{grid-template-columns:1fr 1fr}
.aps-root.aps-right-root .aps-step-grid{grid-template-columns:1fr}
.aps-root.aps-right-root .aps-flow-head{padding:8px}
.aps-root.aps-right-root .aps-steps{padding:0 8px 8px}
.aps-root.aps-right-root .aps-report-body{padding:9px 10px}
.aps-root.aps-right-root .aps-run-head{padding:8px}
.aps-root.aps-right-root .aps-response-head{padding:5px 7px;gap:5px}
.aps-root.aps-right-root .aps-response-title{display:none}
.aps-root.aps-right-root .aps-empty{padding:14px}
.aps-browser{display:flex;gap:6px;flex:1;min-height:0;min-width:0}
.aps-collection{width:154px;flex:0 0 154px;display:flex;flex-direction:column;min-height:0;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-layer-1);overflow:hidden}
.aps-collection-head{display:flex;align-items:center;gap:4px;height:32px;min-height:32px;padding:0 5px;border-bottom:.5px solid var(--dsw-alias-border-l3);box-sizing:border-box}
.aps-collection-title{flex:1;min-width:0;font-size:10px;font-weight:650;letter-spacing:.04em;text-transform:uppercase;color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.aps-collection-search{padding:5px 6px 3px}
.aps-collection-search input{width:100%;height:24px;padding:0 6px;border:1px solid var(--dsw-alias-border-l1);border-radius:5px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:10.5px;min-width:0}
.aps-tree{flex:1;min-height:0;overflow:auto;padding:0 4px 6px;scrollbar-width:thin}
.aps-folder{display:flex;align-items:center;gap:4px;width:100%;height:24px;padding:0 4px;border:0;border-radius:4px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:10.5px;font-weight:600;cursor:pointer;text-align:left;margin-top:2px}
.aps-folder:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.aps-folder-chevron{width:10px;font-size:9px;flex:0 0 auto;text-align:center;opacity:.8}
.aps-folder-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.aps-count{font-size:9px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);border-radius:999px;padding:0 4px;min-width:14px;text-align:center}
.aps-tree-item{display:flex;align-items:center;gap:4px;width:100%;min-height:26px;padding:3px 5px;border:1px solid transparent;border-radius:5px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:10.5px;cursor:pointer;text-align:left}
.aps-tree-item:hover{background:var(--dsw-alias-bg-layer-2)}
.aps-tree-item.active{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 12%,transparent);border-color:color-mix(in srgb,var(--dsw-alias-brand-primary) 25%,transparent)}
.aps-tree-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.aps-tree-empty{padding:10px 6px;color:var(--dsw-alias-label-secondary);font-size:10.5px;line-height:1.5}
.aps-detail{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;gap:6px}
.aps-open-tabs{display:flex;align-items:center;gap:3px;flex:0 0 auto;overflow-x:auto;padding:1px 1px 3px;scrollbar-width:thin}
.aps-doc-tab{display:flex;align-items:center;gap:4px;height:26px;padding:0 5px;border:1px solid var(--dsw-alias-border-l1);border-radius:6px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:10.5px;cursor:pointer;flex:0 0 auto;max-width:158px}
.aps-doc-tab:hover{background:var(--dsw-alias-bg-layer-2)}
.aps-doc-tab.active{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 12%,var(--dsw-alias-bg-layer-1));border-color:color-mix(in srgb,var(--dsw-alias-brand-primary) 30%,var(--dsw-alias-border-l1));color:var(--dsw-alias-brand-primary);font-weight:600}
.aps-doc-name{max-width:108px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.aps-doc-close{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;padding:0;border:0;border-radius:3px;background:transparent;color:inherit;cursor:pointer;opacity:.55;flex:0 0 auto}
.aps-doc-close:hover{background:color-mix(in srgb,var(--dsw-alias-label-primary) 10%,transparent);opacity:1}
.aps-doc-add{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;padding:0;border:1px dashed var(--dsw-alias-border-l2);border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;flex:0 0 auto}
.aps-doc-add:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.aps-collection-toggle{width:22px;height:22px;flex:0 0 auto}
.aps-detail > .aps-right-request{flex:1;height:auto;min-height:0}
.aps-detail > .aps-flow-wrap{flex:1;min-height:0}
.aps-method.FLOW{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2)}
.aps-root.aps-right-root .aps-open-tabs{padding-top:0}
.aps-root.aps-right-root .aps-doc-tab{height:24px}
.aps-json-tree{padding:2px 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;line-height:1.5}
.aps-json-row{display:flex;align-items:flex-start;gap:5px;min-width:0;padding:1px 0}
.aps-json-toggle{display:inline-flex;align-items:center;justify-content:center;width:13px;height:16px;padding:0;border:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:10px;cursor:pointer;flex:0 0 auto}
.aps-json-toggle-spacer{width:13px;flex:0 0 auto}
.aps-json-key{color:var(--dsw-alias-label-primary);min-width:0;overflow-wrap:anywhere}
.aps-json-type{font-size:9px;color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l1);border-radius:3px;padding:0 3px;line-height:14px;flex:0 0 auto}
.aps-json-type.string{color:var(--dsw-alias-state-success-primary)}
.aps-json-type.number{color:var(--dsw-alias-state-warn-primary)}
.aps-json-type.boolean{color:var(--dsw-alias-brand-primary)}
.aps-json-value{color:var(--dsw-alias-label-primary);min-width:0;overflow-wrap:anywhere;opacity:.9}
.aps-json-value.string{color:var(--dsw-alias-state-success-primary)}
.aps-json-value.number{color:var(--dsw-alias-state-warn-primary)}
.aps-json-value.boolean{color:var(--dsw-alias-brand-primary)}
.aps-json-count{font-size:9px;color:var(--dsw-alias-label-secondary);flex:0 0 auto}
.aps-json-children{border-left:1px dashed var(--dsw-alias-border-l1);margin-left:6px;padding-left:4px}
.aps-json-more{color:var(--dsw-alias-label-secondary);font-size:10px;padding-left:18px}
.aps-input-shell{display:inline-flex;align-items:center;width:100%;min-width:0;max-width:100%}
.aps-name-row .aps-input-shell,.aps-url-row .aps-input-shell,.aps-meta-row .aps-input-shell{width:auto}
.aps-run-env{width:132px;flex:0 0 132px}
.aps-input-shell > span{width:100%;min-width:0}
.aps-input-shell input{width:100%;min-width:0}
.aps-input-shell.aps-mono input{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.aps-name-field{flex:1 1 150px;min-width:90px}
.aps-url-field{flex:1 1 180px;min-width:120px}
.aps-select-menu{display:inline-flex;width:auto;max-width:100%;min-width:0}
.aps-select-trigger{display:inline-flex;align-items:center;justify-content:space-between;gap:4px;min-width:0;max-width:100%;font-size:11px}
.aps-select-trigger .aps-select-value{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.aps-select-trigger.method{min-width:82px;font-weight:650}
.aps-select-trigger.aps-right-select{width:100%}
.aps-mode-bar{display:flex;align-items:center;gap:8px;height:38px;min-height:38px;padding:3px 8px;border-bottom:.5px solid var(--dsw-alias-border-l3);background:var(--dsw-alias-bg-base);box-sizing:border-box;flex:0 0 auto}
.aps-mode-bar .aps-mode-tabs{margin:0;width:auto;height:32px;padding:4px;box-sizing:border-box;flex:1 1 auto;min-width:0;font-size:13px}
.aps-mode-bar .aps-mode-tabs button[role="tab"]{height:24px;line-height:24px;padding:0 8px;font-size:13px}
.aps-mode-actions button{height:24px;min-height:24px;padding:0 8px;font-size:12px;line-height:1.2}
.aps-mode-actions{display:flex;align-items:center;gap:8px;flex:0 0 auto;padding:0 2px}
.aps-mode-tabs{margin:4px 7px 0;width:calc(100% - 14px);flex:0 0 auto;font-size:10.5px}
.aps-request-tabs{margin:7px 8px 0;width:calc(100% - 16px);flex:0 0 auto;font-size:10.5px}
.aps-response-tabs{max-width:100%;font-size:10px}
.aps-folder-row{min-height:0}
.aps-folder-content{padding-left:2px}
.aps-tree .aps-tree-item{display:flex;align-items:center;gap:4px;width:100%;min-height:24px;padding:2px 5px;justify-content:flex-start;text-align:left;font-size:10.5px;border-radius:5px}
.aps-tree .aps-tree-item.active{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 12%,transparent);color:var(--dsw-alias-brand-primary)}
.aps-doc-tab{display:flex;align-items:center;gap:1px;height:25px;padding:0 2px 0 0;border:1px solid var(--dsw-alias-border-l1);border-radius:6px;background:var(--dsw-alias-bg-layer-1);flex:0 0 auto;max-width:166px}
.aps-doc-tab.active{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 11%,var(--dsw-alias-bg-layer-1));border-color:color-mix(in srgb,var(--dsw-alias-brand-primary) 28%,var(--dsw-alias-border-l1))}
.aps-doc-tab .aps-doc-main{height:23px;padding:0 4px;min-width:0;gap:4px;justify-content:flex-start;font-size:10.5px;max-width:132px}
.aps-doc-tab .aps-doc-main .aps-method{min-width:32px;height:16px;font-size:8.5px}
.aps-json-tree-dsh{font-size:10.5px}
.aps-split{display:flex;flex:1;min-height:0;min-width:0;align-items:stretch}
.aps-split-left{flex:0 0 auto;min-width:0;display:flex;overflow:hidden}
.aps-split-left .aps-collection{width:100%;flex:1 1 auto;min-width:0}
.aps-split-left > *{width:100%;min-width:0}
.aps-split-right{flex:1;min-width:0;display:flex;overflow:hidden}
.aps-split-right > *{width:100%;min-width:0}
.aps-split-handle{flex:0 0 6px;position:relative;cursor:col-resize;outline:none;background:transparent;touch-action:none}
.aps-split-handle::after{content:'';position:absolute;top:38px;bottom:6px;left:2px;width:1px;border-radius:1px;background:var(--dsw-alias-border-l1);transition:background .12s ease,width .12s ease,left .12s ease}
.aps-split-handle:hover::after,.aps-split-handle:focus-visible::after,.aps-split-handle[data-dragging]::after{left:1.5px;width:2px;background:var(--dsw-alias-brand-primary)}
.aps-name-field input{font-size:14px;font-weight:650}
.aps-url-field input{font-size:11.5px}
.aps-tiny input{height:24px;font-size:10.5px;padding:0 6px}
.aps-tree .aps-record-item{display:flex;flex-direction:column;align-items:flex-start;gap:2px;width:100%;height:auto;min-height:34px;padding:4px 5px;border-radius:5px;text-align:left;font-size:10.5px}
.aps-tree .aps-record-item.active{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 12%,transparent)}
.aps-record-name{width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:550}
.aps-record-meta{width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary);font-size:9.5px}
.aps-tree .aps-record-item .aps-pill-ok,.aps-tree .aps-record-item .aps-pill-bad{margin-bottom:1px}
.aps-folder-row button{font-size:10.5px}
.aps-tree .aps-folder-row{padding:0}
.aps-tree .aps-folder-row > div{min-height:24px}
.aps-tree .aps-folder-row button{padding:0 4px}
.aps-doc-tab .aps-doc-main{color:inherit}
.aps-doc-tab .aps-doc-main:hover{background:transparent}
.aps-header-trigger{display:inline-flex;align-items:center;justify-content:center;gap:4px;height:26px;padding:0 7px;border:1px solid transparent;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;cursor:pointer;white-space:nowrap}
.aps-header-trigger:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.aps-header-trigger:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
@media (max-width:900px){.aps-nav{width:230px;min-width:200px}.aps-header-meta .aps-root-badge{max-width:180px}.aps-test-grid{grid-template-columns:1fr 1fr}.aps-flow-meta{gap:5px}}

/* DSH Settings alignment: 13px type, 34px fields, 0.5px borders, layer-3 surfaces. */
.aps-root{font-size:13px}
.aps-root button{font-size:13px}
.aps-root input{font-size:13px}
.aps-root textarea{font-size:13px}
.aps-brand-title{font-size:14px}
.aps-brand-sub,.aps-model-badge,.aps-list-sub,.aps-dirty{font-size:12px}
.aps-nav-tab{font-size:13px}
.aps-collection-title,.aps-folder-row button,.aps-tree-empty{font-size:12px}
.aps-tree .aps-tree-item,.aps-list-name,.aps-tree-name,.aps-record-name{font-size:13px}
.aps-record-meta{font-size:11px}
.aps-method{font-size:10px}
.aps-field-label{font-size:13px;font-weight:500;line-height:1.5;color:var(--dsw-alias-label-primary)}
.aps-section-title{font-size:13px;font-weight:600}
.aps-table th{font-size:12px}
.aps-meta-row,.aps-response-meta{font-size:12px}
.aps-code,.aps-textarea,.aps-assert-result{font-size:13px}
.aps-empty-title{font-size:14px}
.aps-empty-hint{font-size:13px}
.aps-stat-label{font-size:11px}
.aps-stat-value{font-size:16px}
.aps-report-title{font-size:14px}
.aps-report-text{font-size:12.5px}
.aps-doc-tab .aps-doc-main{font-size:12px}
.aps-json-tree-dsh{font-size:12px}
.aps-select-trigger{display:inline-flex;align-items:center;justify-content:space-between;gap:6px;height:34px;padding:0 10px;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.5}
.aps-select-trigger:hover:not(:disabled){background:var(--dsw-alias-bg-layer-3)}
.aps-select-trigger:focus-visible{border-color:var(--dsw-alias-state-business-primary);outline:none}
.aps-select-list button{font-size:13px;line-height:1.5}
.aps-input-shell > span{height:34px;padding:0 12px;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-layer-3);box-sizing:border-box}
.aps-input-shell > span:focus-within{border-color:var(--dsw-alias-state-business-primary)}
.aps-input-shell input{font-size:13px;line-height:1.5}
.aps-input-shell.aps-tiny > span{height:30px;padding:0 8px}
.aps-tiny input{height:28px;font-size:12px}
.aps-name-field input{font-size:14px;font-weight:600}
.aps-url-field input{font-size:13px}
.aps-textarea{padding:10px 12px;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-layer-3);line-height:1.55}
.aps-textarea:focus-visible{border-color:var(--dsw-alias-state-business-primary);outline:none}
.aps-card{border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-bg-layer-1)}
.aps-icon-button{width:16px !important;height:16px !important;min-width:16px !important;padding:0 !important;gap:0 !important;border:0 !important;border-radius:var(--dsw-radius-xs) !important;background:transparent !important;color:var(--dsw-alias-label-tertiary) !important;line-height:1 !important;display:inline-flex;align-items:center;justify-content:center}
.aps-icon-button:hover:not(:disabled){background:transparent !important;color:var(--dsw-alias-label-primary) !important}
.aps-icon-button:disabled{opacity:.4}
.aps-icon-button > span{display:inline-flex;align-items:center;justify-content:center;margin:0}
.aps-icon-button svg{width:16px;height:16px}
.aps-doc-tab{height:28px;border-width:.5px;border-radius:var(--dsw-radius-sm)}
.aps-doc-tab .aps-doc-main{height:26px}
.aps-folder-row > div{min-height:28px}
.aps-tree .aps-record-item{min-height:40px}
.aps-method{height:18px;line-height:18px}
.aps-open-tabs{display:flex;align-items:center;gap:2px;height:32.5px;min-height:32.5px;flex:0 0 32.5px;padding:2px 6px;border-bottom:1px solid var(--dsw-alias-border-l3);background:var(--dsw-alias-bg-base);box-sizing:border-box;scrollbar-width:none}
.aps-open-tabs::-webkit-scrollbar{display:none}
@media (-webkit-min-device-pixel-ratio:2),(min-resolution:2dppx){.aps-open-tabs{border-bottom-width:.5px}}
.aps-doc-tab{display:flex;align-items:center;gap:1px;height:28px;padding:0 3px 0 10px;border:0;border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-secondary);flex:0 0 auto;max-width:170px}
.aps-doc-tab:hover{background:var(--dsw-alias-interactive-bg-hover)}
.aps-doc-tab.active{background:var(--dsw-alias-markdown-tag);color:var(--dsw-alias-label-primary)}
.aps-doc-tab .aps-doc-main{height:28px;padding:0;border:0;background:transparent;color:inherit;font-size:13px;font-weight:400;max-width:128px;min-width:0;justify-content:flex-start;gap:0}
.aps-doc-tab.active .aps-doc-main{color:var(--dsw-alias-label-primary)}
.aps-doc-tab .aps-doc-name{max-width:128px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.aps-doc-tab .aps-icon-button{width:18px !important;height:18px !important;min-width:18px !important;opacity:0;pointer-events:none;color:var(--dsw-alias-label-tertiary) !important}
.aps-doc-tab:hover .aps-icon-button,.aps-doc-tab.active .aps-icon-button{opacity:1;pointer-events:auto}
.aps-doc-tab .aps-icon-button svg{width:14px;height:14px}
.aps-doc-tab .aps-icon-button:hover{color:var(--dsw-alias-label-primary) !important}
.aps-monaco{position:relative;width:100%;min-height:96px;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-layer-3);overflow:hidden;box-sizing:border-box}
.aps-monaco-host{position:absolute;inset:0}
.aps-monaco .monaco-editor,.aps-monaco .overflow-guard{border-radius:inherit}
.aps-monaco-loading{position:absolute;left:10px;top:8px;z-index:1;color:var(--dsw-alias-label-tertiary);font-size:12px;pointer-events:none}
.aps-vsplit{display:flex;flex-direction:column;flex:1;min-height:0;min-width:0}
.aps-vsplit-top{flex:0 0 auto;min-height:0;display:flex;overflow:hidden}
.aps-vsplit-top > *{width:100%;min-height:0}
.aps-vsplit-bottom{flex:1;min-height:0;display:flex;overflow:hidden}
.aps-vsplit-bottom > *{width:100%;min-height:0}
.aps-vsplit-handle{flex:0 0 6px;position:relative;cursor:row-resize;outline:none;background:transparent;touch-action:none}
.aps-vsplit-handle::after{content:'';position:absolute;left:4px;right:4px;top:2px;height:1px;border-radius:1px;background:var(--dsw-alias-border-l1);transition:background .12s ease,height .12s ease,top .12s ease}
.aps-vsplit-handle:hover::after,.aps-vsplit-handle:focus-visible::after,.aps-vsplit-handle[data-dragging]::after{top:1.5px;height:2px;background:var(--dsw-alias-brand-primary)}
.aps-right-request > .aps-vsplit{flex:1}
.aps-vsplit-top .aps-editor-card{height:100%;min-height:0;flex:1}
.aps-vsplit-bottom .aps-response-card{height:100%;min-height:0;flex:1}
.aps-detail{gap:0}
.aps-detail-head{height:32px;min-height:32px;flex:0 0 32px;display:flex;align-items:center;padding:0 10px;border-bottom:.5px solid var(--dsw-alias-border-l3);box-sizing:border-box;background:var(--dsw-alias-bg-base)}
.aps-detail-title{font-size:13px;font-weight:500;color:var(--dsw-alias-label-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.aps-detail-body{flex:1;min-height:0;display:flex;flex-direction:column;padding:6px;box-sizing:border-box}
.aps-collection-title{font-size:13px;font-weight:500;letter-spacing:normal;text-transform:none;color:var(--dsw-alias-label-primary)}
.aps-section-title{font-size:13px;font-weight:600;letter-spacing:normal;text-transform:none;color:var(--dsw-alias-label-primary)}
.aps-table th{font-size:12px;font-weight:500;letter-spacing:normal;text-transform:none}
.aps-response-title{font-size:13px;font-weight:600;letter-spacing:normal;text-transform:none}
.aps-panel-toggle{width:28px !important;height:28px !important;min-width:28px !important;padding:0 !important;border:0 !important;border-radius:var(--dsw-radius-sm) !important;background:transparent !important;color:var(--dsw-alias-label-secondary) !important;display:inline-flex !important;align-items:center;justify-content:center}
.aps-panel-toggle:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover) !important;color:var(--dsw-alias-label-secondary) !important}
.aps-panel-toggle:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-2px}
.aps-tab-add{width:28px !important;height:28px !important;min-width:28px !important;padding:0 !important;border:0 !important;border-radius:var(--dsw-radius-sm) !important;background:transparent !important;color:var(--dsw-alias-label-secondary) !important;display:inline-flex !important;align-items:center;justify-content:center}
.aps-tab-add:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover) !important;color:var(--dsw-alias-label-primary) !important}
.aps-doc-tab .aps-tab-close{width:20px !important;height:20px !important;min-width:20px !important;padding:0 !important;border:0 !important;border-radius:var(--dsw-radius-sm) !important;background:transparent !important;color:var(--dsw-alias-label-tertiary) !important;opacity:0;pointer-events:none;display:inline-flex !important;align-items:center;justify-content:center}
.aps-doc-tab:hover .aps-tab-close,.aps-doc-tab.active .aps-tab-close{opacity:1;pointer-events:auto}
.aps-doc-tab .aps-tab-close:hover{color:var(--dsw-alias-label-primary) !important;background:var(--dsw-alias-interactive-bg-hover) !important}
.aps-doc-tab .aps-tab-close svg{width:14px;height:14px}
.aps-field-label{letter-spacing:normal}
.aps-subhead{font-size:12px;font-weight:600;letter-spacing:normal;text-transform:none;color:var(--dsw-alias-label-primary)}
.aps-stat-label{font-size:11px;letter-spacing:normal;text-transform:none}
.aps-stat-grid{border:.5px solid var(--dsw-alias-border-l2)}
.aps-test-card,.aps-step,.aps-step-result,.aps-assert-result,.aps-notice{border-width:.5px}
.aps-test-card,.aps-step{border-radius:var(--dsw-radius-lg)}
.aps-step-result,.aps-assert-result{border-radius:var(--dsw-radius-md)}
.aps-collection{border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-lg)}
.aps-details{border-top:.5px dashed var(--dsw-alias-border-l2)}
.aps-collection-head{position:sticky;top:0;z-index:2;background:var(--dsw-alias-bg-layer-1)}
.aps-open-tabs{position:relative;z-index:1}
.aps-right-workbench{display:flex;flex-direction:column;flex:1;min-height:0;min-width:0;padding:6px;box-sizing:border-box}
.aps-right-workbench > .aps-vsplit{flex:1}
.aps-vsplit-top .aps-flow-wrap{height:100%;min-height:0;flex:1}
.aps-flow-result{height:100%;min-height:0;overflow:auto;display:flex;flex-direction:column}
.aps-project{display:flex;flex-direction:column;gap:12px;min-height:0;max-height:min(72vh,760px);overflow:auto;padding-right:2px}
.aps-project-tabs{flex:0 0 auto}
.aps-project-section{display:flex;flex-direction:column;gap:10px;min-height:0}
.aps-project-row{display:flex;align-items:flex-end;gap:8px;flex-wrap:wrap}
.aps-project-row .aps-field{flex:1 1 180px}
.aps-bulk-vars{display:flex;flex-direction:column;gap:8px}
.aps-bulk-preview{max-height:180px;overflow:auto;border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm);padding:4px 6px}
.aps-multipart{display:flex;flex-direction:column;gap:5px}.aps-multipart-row{display:flex;align-items:center;gap:5px;min-width:0}.aps-multipart-key{width:120px;flex:0 0 120px}.aps-multipart-value{flex:1;min-width:80px}.aps-multipart-file{flex:1;min-width:80px;font-size:11px;color:var(--dsw-alias-label-tertiary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 4px}
.aps-env-vars{display:flex;flex-direction:column;gap:6px;max-height:300px;overflow:auto;border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm);padding:7px 8px}
.aps-import-preview{display:flex;flex-direction:column;gap:5px;max-height:220px;overflow:auto;border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm);padding:6px 8px}
.aps-project-hint{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.6}
.aps-project-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap}
.aps-mock-panel{display:flex;flex-direction:column;gap:8px;min-height:0}
.aps-mock-panel > .aps-field{min-height:0}
.aps-scripts-panel{display:flex;flex-direction:column;gap:10px;min-height:0}
.aps-scripts-panel .aps-field{min-height:0}
.aps-history{display:flex;flex-direction:column;gap:6px;max-height:min(66vh,640px);overflow:auto}
.aps-history-row.active{background:var(--dsw-alias-interactive-bg-hover)}
.aps-history-row{display:flex;align-items:center;gap:10px;padding:8px 10px;border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-layer-1)}
.aps-history-main{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}
.aps-history-name{font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.aps-history-meta{font-size:12px;color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.aps-cases{display:flex;flex-direction:column;gap:12px;max-height:min(72vh,760px);overflow:auto;padding-right:2px}
.aps-cases-list{display:flex;flex-direction:column;gap:4px;min-width:0}
.aps-case-row{display:flex;align-items:center;justify-content:flex-start;gap:7px;width:100%;height:30px;padding:0 8px;font-size:13px;text-align:left}
.aps-case-row.active{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.aps-case-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.aps-cases-editor{display:flex;flex-direction:column;gap:9px;min-height:0}
.aps-highlight{background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 28%,transparent);color:inherit;border-radius:2px;padding:0 1px}
.aps-doc-card{display:flex;flex-direction:column;gap:12px;min-height:0;overflow:auto;padding:2px 2px 12px}
.aps-doc-head{display:flex;align-items:center;gap:8px;min-width:0}
.aps-doc-name{font-size:15px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.aps-doc-url{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;color:var(--dsw-alias-label-secondary);overflow-wrap:anywhere}
.aps-doc-description{font-size:13px;line-height:1.65;color:var(--dsw-alias-label-secondary);white-space:pre-wrap}
.aps-doc-section{display:flex;flex-direction:column;gap:5px}
.aps-doc-section-head{display:flex;align-items:center;gap:4px}
.aps-doc-section-head .aps-section-title{margin:0;flex:1}
.aps-doc-example-viewer{display:flex;flex-direction:column;gap:5px}
.aps-doc-example-headers{font-size:11px}
.aps-doc-example-toolbar{display:flex;align-items:center;gap:5px;flex-wrap:wrap}
.aps-doc-example{display:flex;flex-direction:column;gap:4px}
.aps-doc-example-head{display:flex;align-items:center;gap:6px}
.aps-doc-example-name{font-size:12px;color:var(--dsw-alias-label-secondary)}
.aps-doc-assert{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:var(--dsw-alias-label-secondary);padding:3px 6px;border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-bg-layer-1)}
.aps-code-snippet{display:flex;flex-direction:column;gap:9px}
.aps-response-tools{display:flex;align-items:center;gap:6px;margin-bottom:6px;min-width:0}
.aps-response-viewtabs{flex:0 0 auto;font-size:11px}
.aps-response-viewtabs button[role="tab"]{height:24px;padding:0 8px;font-size:11px}
.aps-path-result{border-left:3px solid var(--dsw-alias-state-business-primary);max-height:160px;overflow:auto}
.aps-trend-card{padding:10px 12px;display:flex;flex-direction:column;gap:8px}
.aps-trend-head{display:flex;align-items:center;gap:7px;min-width:0;flex-wrap:wrap}
.aps-trend-head .aps-section-title{margin:0}
.aps-trend-tabs{font-size:10px}
.aps-trend-tabs button[role="tab"]{height:22px;padding:0 7px;font-size:10px}
.aps-trend{display:flex;align-items:flex-end;gap:4px;height:76px;min-height:76px}
.aps-trend-item{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:3px;height:100%}
.aps-trend-track{flex:1;width:100%;display:flex;align-items:flex-end;justify-content:center;min-height:0}
.aps-trend-bar{width:min(18px,100%);border-radius:3px 3px 1px 1px;min-height:4px;background:var(--dsw-alias-state-success-primary);opacity:.55}
.aps-trend-bar.fail{background:var(--dsw-alias-state-error-primary)}
.aps-trend-item.current .aps-trend-bar{opacity:1;box-shadow:0 0 0 1px var(--dsw-alias-brand-primary)}
.aps-trend-label{font-size:9px;color:var(--dsw-alias-label-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.aps-relations{display:flex;flex-direction:column;gap:12px;max-height:min(70vh,680px);overflow:auto}
.aps-rel-graph-wrap{position:relative;flex:0 0 auto}
.aps-rel-controls{position:absolute;right:6px;top:6px;z-index:1;display:flex;align-items:center;gap:2px;background:color-mix(in srgb,var(--dsw-alias-bg-layer-1) 88%,transparent);border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm);padding:2px 3px}
.aps-rel-graph{width:100%;height:172px;cursor:grab;touch-action:none;flex:0 0 auto;border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-bg-layer-1)}
.aps-rel-node-group.clickable:hover .aps-rel-node{stroke:var(--dsw-alias-brand-primary);stroke-width:1.5}
.aps-rel-node-group.clickable:hover .aps-rel-count{fill:var(--dsw-alias-brand-primary)}
.aps-rel-edge{stroke:var(--dsw-alias-border-l2);stroke-width:1;stroke-dasharray:3 3}
.aps-rel-node{fill:var(--dsw-alias-bg-layer-2);stroke:var(--dsw-alias-border-l2);stroke-width:.5}
.aps-rel-center{fill:color-mix(in srgb,var(--dsw-alias-brand-primary) 12%,var(--dsw-alias-bg-layer-1));stroke:var(--dsw-alias-brand-primary);stroke-width:1}
.aps-rel-count{font-size:12px;font-weight:650;fill:var(--dsw-alias-label-primary)}
.aps-rel-label{font-size:7px;fill:var(--dsw-alias-label-tertiary)}
.aps-rel-center-label{font-size:8px;font-weight:600;fill:var(--dsw-alias-label-secondary)}
.aps-rel-center-name{font-size:6.5px;fill:var(--dsw-alias-label-primary)}
.aps-relations-section{display:flex;flex-direction:column;gap:4px;min-width:0}
.aps-relations-row{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--dsw-alias-label-secondary);padding:3px 6px}
.aps-relations-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.aps-run-stats{display:flex;align-items:stretch;gap:10px;flex-wrap:wrap}
.aps-test-meter{display:flex;align-items:center;gap:8px;min-width:150px;padding:7px 10px;border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-bg-layer-1)}
.aps-test-ring{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex:0 0 auto;position:relative}
.aps-test-ring::after{content:'';position:absolute;inset:4px;border-radius:50%;background:var(--dsw-alias-bg-layer-1)}
.aps-test-ring-value{position:relative;z-index:1;font-size:9.5px;font-weight:650;color:var(--dsw-alias-label-primary)}
.aps-test-meter-label{display:flex;flex-direction:column;gap:1px;font-size:10px;color:var(--dsw-alias-label-secondary)}
.aps-run-stats>.aps-stat-grid{flex:1;min-width:260px}
.aps-diff{display:flex;flex-direction:column;gap:8px;max-height:min(74vh,760px);overflow:auto}
.aps-diff-head{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.aps-diff-meta{font-size:11px;color:var(--dsw-alias-label-tertiary);border-top:.5px solid var(--dsw-alias-border-l2);padding-top:6px}
.aps-diff-lines{display:flex;flex-direction:column;border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm);overflow:auto;max-height:min(54vh,560px);background:var(--dsw-alias-bg-layer-1)}
.aps-diff-line{display:flex;gap:6px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;line-height:1.55;padding:0 6px;white-space:pre-wrap;word-break:break-word}
.aps-diff-line.add{background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 14%,transparent);color:var(--dsw-alias-state-success-primary)}
.aps-diff-line.del{background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 12%,transparent);color:var(--dsw-alias-state-error-primary)}
.aps-diff-sign{flex:0 0 10px;opacity:.7}
.aps-diff-nav{display:flex;align-items:center;gap:2px;flex:0 0 auto}
.aps-diff-line.current,.aps-diff-split-row.current{outline:1px solid var(--dsw-alias-brand-primary);outline-offset:-1px}
.aps-diff-fold{display:flex;align-items:center;justify-content:center;padding:2px 6px;color:var(--dsw-alias-label-tertiary);background:var(--dsw-alias-bg-layer-2)}
.aps-diff-fold button{font-size:10px;height:20px}
.aps-diff-no{flex:0 0 26px;text-align:right;padding-right:4px;color:var(--dsw-alias-label-tertiary);opacity:.7;user-select:none}
.aps-vars-source{display:flex;align-items:center;gap:5px;flex-wrap:wrap}
.aps-vars-shadow{font-size:10px;color:var(--dsw-alias-label-tertiary)}
.aps-diff-text{white-space:pre-wrap;word-break:break-word}
.aps-diff-char{background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 38%,transparent);border-radius:2px}
.aps-diff-split-row.add .aps-diff-char{background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 34%,transparent)}
.aps-diff-split-row.del .aps-diff-char{background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 30%,transparent)}
.aps-diff-headers{display:flex;flex-direction:column;gap:5px}
.aps-diff-header-row .aps-diff-old{color:var(--dsw-alias-state-error-primary)}
.aps-diff-header-row .aps-diff-new{color:var(--dsw-alias-state-success-primary)}
.aps-trend-range{flex:0 0 auto;width:112px}
.aps-trend-range button{height:24px;font-size:10px}
.aps-diff-tabs{font-size:10px;flex:0 0 auto}
.aps-diff-tabs button[role="tab"]{height:22px;padding:0 7px;font-size:10px}
.aps-diff-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.aps-diff-split{display:flex;flex-direction:column;border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm);overflow:auto;max-height:min(54vh,560px);background:var(--dsw-alias-bg-layer-1)}
.aps-diff-split-row{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--dsw-alias-border-l2);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;line-height:1.55}
.aps-diff-split-row.head{position:sticky;top:0;z-index:1;font-family:inherit;font-size:10px;font-weight:650;color:var(--dsw-alias-label-tertiary);background:var(--dsw-alias-bg-layer-2);padding:4px 6px}
.aps-diff-split-cell{background:var(--dsw-alias-bg-layer-1);padding:0 6px;white-space:pre-wrap;word-break:break-word;min-height:17px}
.aps-diff-split-row.add .aps-diff-split-cell:last-child{background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 14%,var(--dsw-alias-bg-layer-1));color:var(--dsw-alias-state-success-primary)}
.aps-diff-split-row.del .aps-diff-split-cell:first-child{background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 12%,var(--dsw-alias-bg-layer-1));color:var(--dsw-alias-state-error-primary)}
.aps-vars-inspector{display:flex;flex-direction:column;gap:9px;max-height:min(70vh,680px);overflow:auto}
.aps-vars-missing td{color:var(--dsw-alias-state-error-primary)}
.aps-matrix{display:flex;flex-direction:column;gap:9px;max-height:min(76vh,780px);overflow:auto}
.aps-matrix-envs{display:flex;flex-wrap:wrap;gap:6px 14px;padding:4px 0}
.aps-matrix-results{display:flex;flex-direction:column;gap:8px}
.aps-matrix-chart{display:flex;flex-direction:column;gap:4px;border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm);padding:7px 9px;background:var(--dsw-alias-bg-layer-1)}
.aps-matrix-chart-row{display:flex;align-items:center;gap:8px;font-size:11px}
.aps-matrix-chart-name{width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary)}
.aps-matrix-chart-track{flex:1;height:6px;border-radius:3px;background:var(--dsw-alias-bg-layer-2);overflow:hidden}
.aps-matrix-chart-fill{display:block;height:100%;border-radius:3px;background:var(--dsw-alias-state-success-primary);opacity:.75}
.aps-matrix-chart-fill.fail{background:var(--dsw-alias-state-error-primary)}
.aps-matrix-group{display:flex;flex-direction:column;gap:4px;padding:8px 10px}
.aps-matrix-env{font-size:12px;font-weight:600}
.aps-matrix-tabs{font-size:10px}
.aps-matrix-tabs button[role="tab"]{height:22px;padding:0 7px;font-size:10px}
.aps-matrix-table-wrap{overflow:auto;border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm)}
.aps-matrix-table td,.aps-matrix-table th{white-space:nowrap}
.aps-matrix-pass button{color:var(--dsw-alias-state-success-primary)}
.aps-matrix-fail button{color:var(--dsw-alias-state-error-primary)}
.aps-matrix-diff-row{background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 8%,transparent)}
.aps-matrix-diff{font-size:9px;color:var(--dsw-alias-state-warn-primary);margin-left:4px}
.aps-self-test{display:flex;flex-direction:column;gap:8px;max-height:min(72vh,720px);overflow:auto}

`

    /* ------------------------------------------------------------------ */
    /* Helpers                                                             */
    /* ------------------------------------------------------------------ */

    function uniqueName(base, names) {
      const used = new Set((names || []).filter(Boolean))
      if (!used.has(base)) return base
      let index = 2
      while (used.has(`${base} ${index}`)) index += 1
      return `${base} ${index}`
    }

    function clone(value) {
      return value === undefined ? undefined : JSON.parse(JSON.stringify(value))
    }

    async function callApi(action, payload, sessionId) {
      const body = JSON.stringify({ action, ...(payload || {}), ...(sessionId ? { sessionId } : {}) })
      const init = {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body,
      }
      const transport = globalThis.__DSH_TRANSPORT__
      const response = typeof transport?.fetch === 'function'
        ? await transport.fetch(ENDPOINT, init)
        : await fetch(ENDPOINT, init)
      const text = await response.text()
      let parsed
      try {
        parsed = text.length > 0 ? JSON.parse(text) : null
      } catch {
        throw new Error(text.length > 0 ? text.slice(0, 400) : `HTTP ${response.status}`)
      }
      if (!response.ok || parsed === null || parsed.ok !== true) {
        throw new Error(parsed?.message ?? `HTTP ${response.status}`)
      }
      return parsed.data
    }

    function newRequestDraft() {
      return {
        name: 'Untitled request',
        description: '',
        folder: '',
        method: 'GET',
        url: '{{baseUrl}}/',
        headers: [{ key: 'accept', value: 'application/json', enabled: true }],
        query: [],
        body: { type: 'none', text: '' },
        auth: { type: 'none' },
        tests: [{ type: 'status', op: 'eq', value: 200 }],
        timeoutMs: 30000,
        followRedirects: true,
        variables: {},
      }
    }

    function newFlowDraft() {
      return {
        name: 'Untitled flow',
        description: '',
        folder: '',
        variables: {},
        stopOnFailure: true,
        steps: [newStepDraft(0)],
      }
    }

    function newStepDraft(index) {
      return {
        id: `step-${Date.now()}-${index}`,
        name: `Step ${index + 1}`,
        requestId: '',
        overrides: {},
        extract: [],
        continueOnFailure: false,
        condition: '',
        delayMs: 0,
      }
    }

    function newTestDraft() {
      return { type: 'status', op: 'eq', value: 200 }
    }

    function fmtBytes(value) {
      const bytes = Number(value) || 0
      if (bytes < 1024) return `${bytes} B`
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
      return `${(bytes / 1024 / 1024).toFixed(2)} MB`
    }

    function fmtTime(value) {
      if (!value) return ''
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return String(value)
      const pad = (number) => String(number).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    }

    function fmtDuration(value) {
      const number = Number(value) || 0
      if (number < 1000) return `${Math.round(number)} ms`
      return `${(number / 1000).toFixed(2)} s`
    }

    function pretty(value) {
      if (value === undefined) return ''
      try {
        return JSON.stringify(value, null, 2)
      } catch {
        return String(value)
      }
    }

    function truncate(value, size) {
      const text = String(value ?? '')
      return text.length > size ? `${text.slice(0, size)}\n… (${text.length - size} chars truncated)` : text
    }

    function formatValue(value) {
      if (value === undefined || value === null) return ''
      return typeof value === 'string' ? value : JSON.stringify(value)
    }

    function statusTone(run) {
      return run && run.passed ? 'ok' : 'bad'
    }

    function runSummary(run) {
      if (run && run.summary) return run.summary.summary || run.summary
      const tests = run?.tests ?? []
      return {
        executed: 1,
        passed: run?.passed ? 1 : 0,
        failed: run?.passed ? 0 : 1,
        tests: { total: tests.length, passed: tests.filter((test) => test.passed).length, failed: tests.filter((test) => !test.passed).length },
        avgLatencyMs: run?.response?.durationMs ?? 0,
        maxLatencyMs: run?.response?.durationMs ?? 0,
      }
    }

    function testName(test) {
      return test.name || test.type || ''
    }

    function compareSummary(summary) {
      const tests = summary?.tests || summary?.summary?.tests || { passed: 0, total: 0 }
      return `${tests.passed ?? 0}/${tests.total ?? 0}`
    }

    function methodClass(method) {
      return String(method || 'GET').toUpperCase()
    }

    function tOr(t, key) {
      return typeof t === 'function' ? t(key) : key
    }

    /* ------------------------------------------------------------------ */
    /* Primitive controls                                                  */
    /* ------------------------------------------------------------------ */

    const ICONS = {
      search: IconSearchOutlineRegular,
      plus: IconPlusOutlineRegular,
      trash: IconTrashOutlineRegular,
      save: IconCheckOutlineRegular,
      play: IconPlayOutlineRegular,
      refresh: IconRefreshOutlineRegular,
      braces: IconCodeOutlineRegular,
      close: IconCloseOutlineRegular,
      x: IconCloseOutlineRegular,
      up: IconChevronUpOutlineRegular,
      down: IconChevronDownOutlineRegular,
      chevron: IconChevronRightOutlineRegular,
      copy: IconCopyOutlineRegular,
      doc: IconDeliverDocRegular,
      download: IconDownloadOutlineRegular,
      check: IconCheckOutlineRegular,
      history: IconClockOutlineRegular,
      cases: IconChecklistOutlineRegular,
      list: IconFlatListOutlineRegular,
      panel: IconPanelLeftOutlineRegular,
      link: IconLinkOutlineRegular,
      folder: IconFolderOpenRegular,
      'folder-closed': IconFolderCloseRegular,
    }

    function Icon({ name, size = 14 }) {
      const Component = ICONS[name] || IconInfoOutlineRegular
      return h(Component, { size })
    }

    function StudioIcon({ size = 18, active = false, color }) {
      return h(
        'svg',
        {
          viewBox: '0 0 24 24',
          width: size,
          height: size,
          fill: 'none',
          'aria-hidden': true,
          focusable: false,
          style: { display: 'block', color: color || '#1f5a44', opacity: active ? 1 : 0.9 },
        },
        h('path', {
          d: 'M10.2 13.8a4.1 4.1 0 0 0 5.8 0l2.6-2.6a4.1 4.1 0 0 0-5.8-5.8l-1.4 1.4',
          stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round',
        }),
        h('path', {
          d: 'M13.8 10.2a4.1 4.1 0 0 0-5.8 0l-2.6 2.6a4.1 4.1 0 0 0 5.8 5.8l1.4-1.4',
          stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round',
        }),
        h('path', {
          d: 'm8.8 15.2 6.4-6.4',
          stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', opacity: 0.55,
        }),
      )
    }

    function Button({ children, tone = '', size = '', icon, onClick, disabled, title, type = 'button', className = '', style }) {
      const variant = tone === 'primary' || tone === 'success' ? 'primary' : tone === 'ghost' ? 'ghost' : 'outline'
      const extra = tone === 'success' ? ' aps-button-success' : tone === 'danger' ? ' aps-button-danger' : ''
      return h(
        DshButton,
        {
          variant,
          size: size === 'small' ? 'sm' : 'md',
          className: `${className}${extra}`.trim(),
          icon: icon ? h(Icon, { name: icon, size: size === 'small' ? 12 : 13 }) : undefined,
          onClick,
          disabled,
          title,
          style,
        },
        children,
      )
    }

    function IconButton({ name, onClick, title, disabled, size = 16 }) {
      return h(
        DshTooltip,
        { label: title },
        h(DshButton, {
          variant: 'toolbar',
          size: 'sm',
          className: 'aps-icon-button',
          icon: h(Icon, { name, size: 16 }),
          onClick,
          disabled,
          'aria-label': title,
        }),
      )
    }

    function Field({ label, children, className = '' }) {
      return h('label', { className: `aps-field ${className}` }, label ? h('span', { className: 'aps-field-label' }, label) : null, children)
    }

    function TextInput({ value, onChange, placeholder, className = '', mono = false, style, ...rest }) {
      const classes = className
        .split(/\s+/)
        .filter((name) => name.length > 0 && name !== 'aps-input' && name !== 'aps-tiny-input' && name !== 'mono')
        .join(' ')
      return h(
        'span',
        { className: `aps-input-shell ${mono ? 'aps-mono' : ''} ${classes}`.trim(), style },
        h(DshInput, {
          value: value ?? '',
          placeholder,
          onChange: (event) => onChange(event.target.value),
          ...rest,
        }),
      )
    }

    let monacoModulePromise

    function loadMonaco() {
      if (monacoModulePromise === undefined) {
        monacoModulePromise = (async () => {
          installMonacoWorkers()
          const sources = [
            'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/+esm',
            'https://esm.sh/monaco-editor@0.52.2?bundle',
          ]
          let lastError
          for (const source of sources) {
            try {
              const module = await Promise.race([
                import(source),
                new Promise((_, reject) => window.setTimeout(() => reject(new Error('Monaco load timeout')), 7000)),
              ])
              return module
            } catch (error) {
              lastError = error
            }
          }
          throw lastError
        })()
      }
      return monacoModulePromise
    }

    function installMonacoWorkers() {
      if (typeof window === 'undefined') return
      if (window.MonacoEnvironment && typeof window.MonacoEnvironment.getWorker === 'function') return
      const base = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/esm/vs/'
      const workerUrl = (label) => {
        if (label === 'json') return base + 'language/json/json.worker.js'
        if (label === 'typescript' || label === 'javascript') return base + 'language/typescript/ts.worker.js'
        if (label === 'css' || label === 'scss' || label === 'less') return base + 'language/css/css.worker.js'
        if (label === 'html' || label === 'handlebars' || label === 'razor') return base + 'language/html/html.worker.js'
        return base + 'editor/editor.worker.js'
      }
      window.MonacoEnvironment = {
        getWorker(_workerId, label) {
          try {
            const source = `import ${JSON.stringify(workerUrl(label))};`
            return new Worker(URL.createObjectURL(new Blob([source], { type: 'text/javascript' })), { type: 'module' })
          } catch {
            return new Worker(URL.createObjectURL(new Blob(['self.onmessage = () => {};'], { type: 'text/javascript' })))
          }
        },
      }
    }

    function monacoTheme() {
      const root = document.documentElement
      return root.hasAttribute('data-ds-dark-theme') || root.dataset.theme === 'dark' || root.dataset.colorScheme === 'dark' ? 'vs-dark' : 'vs'
    }

    function MonacoEditor({ value, onChange, language = 'plaintext', rows = 8, placeholder = '', className = '', mono = false, readOnly = false, style }) {
      const hostRef = React.useRef(null)
      const editorRef = React.useRef(null)
      const monacoRef = React.useRef(null)
      const subscriptionRef = React.useRef(null)
      const suppressChangeRef = React.useRef(false)
      const onChangeRef = React.useRef(onChange)
      const [ready, setReady] = React.useState(false)
      const [failed, setFailed] = React.useState(false)
      const height = style && style.height ? style.height : Math.max(96, rows * 20 + 18)
      const outerStyle = { ...(style || {}), height }
      onChangeRef.current = onChange

      React.useEffect(() => {
        let cancelled = false
        loadMonaco()
          .then((monaco) => {
            if (cancelled || hostRef.current === null) return
            monacoRef.current = monaco
            const editor = monaco.editor.create(hostRef.current, {
              value: value ?? '',
              language,
              theme: monacoTheme(),
              automaticLayout: true,
              ariaLabel: placeholder || 'Code editor',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: 13,
              lineHeight: 20,
              minimap: { enabled: false },
              folding: false,
              glyphMargin: false,
              lineNumbersMinChars: 2,
              renderLineHighlight: 'none',
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              tabSize: 2,
              insertSpaces: true,
              padding: { top: 8, bottom: 8 },
              readOnly,
              placeholder,
              scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
            })
            editorRef.current = editor
            subscriptionRef.current = editor.onDidChangeModelContent(() => {
              if (suppressChangeRef.current) return
              onChangeRef.current(editor.getValue())
            })
            setReady(true)
          })
          .catch((error) => {
            console.warn('AirPost: Monaco editor failed to load, using textarea fallback', error)
            if (!cancelled) setFailed(true)
          })
        return () => {
          cancelled = true
          subscriptionRef.current?.dispose()
          subscriptionRef.current = undefined
          editorRef.current?.dispose()
          editorRef.current = undefined
        }
      }, [])

      React.useEffect(() => {
        const editor = editorRef.current
        if (editor === null || editor === undefined) return
        if (editor.getValue() !== (value ?? '')) {
          const position = editor.getPosition()
          suppressChangeRef.current = true
          editor.setValue(value ?? '')
          queueMicrotask(() => { suppressChangeRef.current = false })
          if (position && editor.getModel() && position.lineNumber <= editor.getModel().getLineCount()) editor.setPosition(position)
        }
      }, [value])

      React.useEffect(() => {
        const editor = editorRef.current
        const monaco = monacoRef.current
        if (!editor || !monaco) return
        const model = editor.getModel()
        if (model) monaco.editor.setModelLanguage(model, language)
      }, [language])

      React.useEffect(() => {
        editorRef.current?.updateOptions({ readOnly })
      }, [readOnly])

      if (failed) {
        return h('textarea', {
          className: `aps-textarea ${mono ? 'mono' : ''} ${className}`.trim(),
          style: outerStyle,
          value: value ?? '',
          rows,
          placeholder,
          readOnly,
          onChange: (event) => onChange(event.target.value),
        })
      }

      return h(
        'div',
        { className: `aps-monaco ${className}`.trim(), style: outerStyle },
        h('div', { className: 'aps-monaco-host', ref: hostRef }),
        ready ? null : h('span', { className: 'aps-monaco-loading' }, 'Loading editor…'),
      )
    }

    function TextArea({ value, onChange, placeholder, className = '', mono = false, rows, language = 'plaintext', readOnly = false, style }) {
      return h(MonacoEditor, { value, onChange, placeholder, className, mono, rows, language, readOnly, style })
    }

    function Select({ value, onChange, options, className = '', disabled = false }) {
      const [open, setOpen] = React.useState(false)
      const selected = options.find((option) => String(option.value) === String(value ?? ''))
      const classes = className
        .split(/\s+/)
        .filter((name) => name.length > 0 && name !== 'aps-select')
        .join(' ')
      const anchor = h(
        DshButton,
        {
          variant: 'outline',
          size: 'sm',
          className: `aps-select-trigger ${classes}`.trim(),
          disabled,
          onClick: () => setOpen((current) => !current),
        },
        h('span', { className: 'aps-select-value' }, selected ? selected.label : ''),
        h(Icon, { name: 'chevron', size: 11 }),
      )
      return h(DshMenu, {
        open,
        anchor,
        className: 'aps-select-menu',
        listClassName: 'aps-select-list',
        onClose: () => setOpen(false),
        onSelect: (id) => {
          const option = options.find((entry) => String(entry.value) === String(id))
          if (option) onChange(option.value)
          setOpen(false)
        },
        items: options.map((option) => ({ id: String(option.value), label: option.label, disabled: option.disabled === true })),
        selectedId: String(value ?? ''),
        portal: true,
        compact: true,
        align: 'start',
      })
    }

    function Checkbox({ checked, onChange, label }) {
      return h(DshCheckbox, { checked: Boolean(checked), onChange, label })
    }

    function Pill({ tone = 'neutral', children }) {
      const mapped = tone === 'ok' ? 'success' : tone === 'bad' ? 'danger' : 'neutral'
      return h(DshTag, { tone: mapped, className: `aps-pill-${tone}` }, children)
    }

    function Loading({ label }) {
      return h('div', { className: 'aps-empty' }, h(DshStateDot, { state: 'ongoing', size: 14 }), h('span', { className: 'aps-empty-hint' }, label))
    }

    function Empty({ title, hint, action }) {
      return h('div', { className: 'aps-empty' }, title ? h('div', { className: 'aps-empty-title' }, title) : null, hint ? h('div', { className: 'aps-empty-hint' }, hint) : null, action || null)
    }

    function Notice({ children, tone = '', style }) {
      return h('div', { className: `aps-notice ${tone}`.trim(), style }, children)
    }

    function JsonObjectField({ value, onApply, onChange, applyLabel, rows = 6, hint, array = false }) {
      const [text, setText] = React.useState(() => JSON.stringify(value ?? (array ? [] : {}), null, 2))
      const [error, setError] = React.useState('')
      const last = React.useRef(value)
      React.useEffect(() => {
        if (JSON.stringify(value ?? (array ? [] : {})) !== JSON.stringify(last.current ?? (array ? [] : {}))) {
          last.current = value
          setText(JSON.stringify(value ?? (array ? [] : {}), null, 2))
        }
      }, [value])
      const parseObject = (input) => {
        const parsed = JSON.parse(input || (array ? '[]' : '{}'))
        if (array ? !Array.isArray(parsed) : parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error(array ? 'must be a JSON array' : 'must be a JSON object')
        return parsed
      }
      const apply = () => {
        try {
          const parsed = parseObject(text)
          last.current = parsed
          setError('')
          onApply(parsed)
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : String(reason))
        }
      }
      const edit = (input) => {
        setText(input)
        if (typeof onChange !== 'function') return
        try {
          const parsed = parseObject(input)
          last.current = parsed
          setError('')
          onChange(parsed)
        } catch {
          // Keep the last valid value in the parent until the JSON is valid again.
        }
      }
      return h(
        'div',
        { className: 'aps-field' },
        h(TextArea, { value: text, onChange: edit, rows, mono: true, className: 'tall', placeholder: array ? '[]' : '{}', language: 'json' }),
        error ? h(Notice, { tone: 'bad' }, error) : null,
        h(
          'div',
          { className: 'aps-field-row' },
          h(Button, { size: 'small', onClick: apply }, applyLabel || 'Apply'),
          hint ? h('span', { className: 'aps-muted', style: { fontSize: 10.5 } }, hint) : null,
        ),
      )
    }

    function ErrorBlock({ error, title, raw }) {
      return h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
        h(Notice, { tone: 'bad' }, `${title || 'Error'}: ${error}`),
        raw ? h('details', { className: 'aps-details' }, h('summary', null, 'Raw model output'), h('pre', { className: 'aps-code', style: { maxHeight: 260, overflow: 'auto' } }, truncate(raw, 12000))) : null,
      )
    }

    /* ------------------------------------------------------------------ */
    /* Key/value and assertions                                            */
    /* ------------------------------------------------------------------ */

    function ValueTable({ rows, onChange, addLabel, keyPlaceholder, valuePlaceholder }) {
      const list = Array.isArray(rows) ? rows : []
      const update = (index, patch) => onChange(list.map((row, position) => (position === index ? { ...row, ...patch } : row)))
      const remove = (index) => onChange(list.filter((_row, position) => position !== index))
      const add = () => onChange([...list, { key: '', value: '', enabled: true }])
      return h(
        'div',
        null,
        list.length > 0
          ? h(
              'table',
              { className: 'aps-table' },
              h(
                'thead',
                null,
                h(
                  'tr',
                  null,
                  h('th', { className: 'aps-col-on' }, ''),
                  h('th', null, 'Key'),
                  h('th', null, 'Value'),
                  h('th', { className: 'aps-col-x' }, ''),
                ),
              ),
              h(
                'tbody',
                null,
                list.map((row, index) =>
                  h(
                    'tr',
                    { key: index },
                    h('td', null, h(DshCheckbox, { checked: row.enabled !== false, onChange: (value) => update(index, { enabled: value }), label: '' })),
                    h('td', null, h(TextInput, { className: 'aps-tiny', mono: true, value: row.key ?? '', placeholder: keyPlaceholder, onChange: (value) => update(index, { key: value }) })),
                    h('td', null, h(TextInput, { className: 'aps-tiny', mono: true, value: row.value ?? '', placeholder: valuePlaceholder, onChange: (value) => update(index, { value }) })),
                    h('td', null, h(IconButton, { name: 'x', onClick: () => remove(index), title: 'Remove', size: 11 })),
                  ),
                ),
              ),
            )
          : h('div', { className: 'aps-muted', style: { fontSize: 11.5, padding: '8px 2px' } }, 'None'),
        h(Button, { size: 'small', tone: 'ghost', icon: 'plus', onClick: add, style: { marginTop: 6 } }, addLabel || 'Add'),
      )
    }

    function TestEditor({ tests, onChange, t }) {
      const list = Array.isArray(tests) ? tests : []
      const [advanced, setAdvanced] = React.useState(false)
      const [jsonText, setJsonText] = React.useState(() => pretty(list))
      const [jsonError, setJsonError] = React.useState('')
      const update = (index, patch) => onChange(list.map((test, position) => (position === index ? { ...test, ...patch } : test)))
      const remove = (index) => onChange(list.filter((_test, position) => position !== index))
      const add = () => onChange([...list, newTestDraft()])
      const applyAdvanced = () => {
        try {
          const parsed = JSON.parse(jsonText)
          if (!Array.isArray(parsed)) throw new Error('assertions must be a JSON array')
          setJsonError('')
          onChange(parsed)
        } catch (reason) {
          setJsonError(reason instanceof Error ? reason.message : String(reason))
        }
      }
      const toggleAdvanced = () => {
        if (!advanced) setJsonText(pretty(list))
        setAdvanced(!advanced)
      }
      return h(
        'div',
        null,
        h(
          'div',
          { className: 'aps-section-title', style: { marginBottom: 6 } },
          t('request.tests'),
          h('span', { className: 'aps-muted', style: { textTransform: 'none', fontWeight: 400 } }, `${list.length}`),
          h('span', { className: 'aps-tab-spacer' }),
          h(Button, { size: 'small', tone: 'ghost', onClick: toggleAdvanced }, advanced ? t('common.close') : t('request.advanced')),
        ),
        advanced
          ? h(
              'div',
              null,
              h(TextArea, { value: jsonText, onChange: setJsonText, rows: 12, mono: true, className: 'tall', language: 'json' }),
              jsonError ? h(Notice, { tone: 'bad' }, jsonError) : null,
              h('div', { className: 'aps-field-row', style: { marginTop: 6 } }, h(Button, { size: 'small', onClick: applyAdvanced }, t('common.apply')), h('span', { className: 'aps-muted', style: { fontSize: 10.5 } }, t('request.advancedHint'))),
            )
          : h(
              React.Fragment,
              null,
              list.map((test, index) => {
                const type = test.type || 'status'
                return h(
                  'div',
                  { className: 'aps-test-card', key: index },
                  h(
                    'div',
                    { className: 'aps-test-head' },
                    h('span', { className: 'aps-test-index' }, index + 1),
                    h(TextInput, { className: 'aps-tiny', style: { flex: 1 }, value: test.name ?? '', placeholder: t('request.testName'), onChange: (value) => update(index, { name: value }) }),
                    h(Select, {
                      className: 'aps-select',
                      value: type,
                      onChange: (value) => update(index, { type: value, op: value === 'latency' ? 'lt' : value === 'script' ? '' : 'eq' }),
                      options: [
                        { value: 'status', label: t('request.status') },
                        { value: 'json', label: 'JSON' },
                        { value: 'body', label: t('run.body') },
                        { value: 'header', label: t('request.header') },
                        { value: 'latency', label: t('run.duration') },
                        { value: 'script', label: t('request.script') },
                        { value: 'schema', label: t('request.schema') },
                      ],
                    }),
                    h(IconButton, { name: 'x', onClick: () => remove(index), title: t('common.remove'), size: 11 }),
                  ),
                  type === 'script'
                    ? h(TextArea, { value: test.code ?? '', onChange: (value) => update(index, { code: value }), rows: 3, mono: true, placeholder: t('request.scriptPlaceholder'), language: 'javascript' })
                    : type === 'schema'
                      ? h(JsonObjectField, { value: test.schema || {}, onApply: (value) => update(index, { schema: value }), onChange: (value) => update(index, { schema: value }), applyLabel: t('common.apply'), rows: 6, hint: 'JSON Schema' })
                      : h(
                        'div',
                        { className: 'aps-test-grid' },
                        h(Field, { label: type === 'json' ? t('request.jsonPath') : type === 'header' ? t('request.headerName') : type === 'status' ? t('request.status') : type === 'latency' ? t('run.duration') : t('common.optional') },
                          type === 'json'
                            ? h(TextInput, { className: 'aps-tiny', mono: true, value: test.path ?? '', placeholder: 'data.id', onChange: (value) => update(index, { path: value }) })
                            : type === 'header'
                              ? h(TextInput, { className: 'aps-tiny', mono: true, value: test.header ?? test.path ?? '', placeholder: 'content-type', onChange: (value) => update(index, { header: value }) })
                              : h('span', { className: 'aps-muted', style: { fontSize: 11 } }, type === 'status' ? 'HTTP' : type === 'latency' ? 'ms' : 'body'),
                        ),
                        h(Field, { label: t('request.operator') }, h(Select, {
                          className: 'aps-select',
                          value: test.op ?? 'eq',
                          onChange: (value) => update(index, { op: value }),
                          options: [
                            { value: 'eq', label: 'eq' },
                            { value: 'ne', label: 'ne' },
                            { value: 'exists', label: 'exists' },
                            { value: 'contains', label: 'contains' },
                            { value: 'notcontains', label: 'not contains' },
                            { value: 'regex', label: 'regex' },
                            { value: 'gt', label: 'gt' },
                            { value: 'gte', label: 'gte' },
                            { value: 'lt', label: 'lt' },
                            { value: 'lte', label: 'lte' },
                            { value: 'in', label: 'in' },
                            { value: 'type', label: 'type' },
                          ],
                        })),
                        h(Field, { label: t('request.expected') }, h(TextInput, { className: 'aps-tiny', mono: true, value: test.value ?? '', placeholder: '200', onChange: (value) => update(index, { value }) })),
                        h(Field, { label: t('common.enabled') }, h(Checkbox, { checked: test.enabled !== false, onChange: (value) => update(index, { enabled: value }), label: '' })),
                      ),
                )
              }),
              list.length === 0 ? h('div', { className: 'aps-muted', style: { fontSize: 11.5, padding: '8px 0' } }, t('status.noTests')) : null,
              h(Button, { size: 'small', tone: 'ghost', icon: 'plus', onClick: add, style: { marginTop: 4 } }, t('request.addTest')),
            ),
      )
    }

    /* ------------------------------------------------------------------ */
    /* Request editor and response                                         */
    /* ------------------------------------------------------------------ */

    function MultipartFields({ fields, onChange, t }) {
      const fileRef = React.useRef(null)
      const [target, setTarget] = React.useState(-1)
      const [fileError, setFileError] = React.useState('')
      const update = (index, patch) => onChange((fields || []).map((entry, position) => position === index ? { ...entry, ...patch } : entry))
      const choose = (index) => { setTarget(index); fileRef.current?.click() }
      const handleFile = (event) => {
        const file = event.target.files?.[0]
        if (!file || target < 0) return
        if (file.size > 5 * 1024 * 1024) { setFileError(t('request.fileTooLarge')); event.target.value = ''; return }
        setFileError('')
        const reader = new FileReader()
        reader.onload = () => {
          const result = String(reader.result ?? '')
          const data = result.slice(result.indexOf(',') + 1)
          update(target, { type: 'file', filename: file.name, contentType: file.type, data })
        }
        reader.readAsDataURL(file)
        event.target.value = ''
      }
      return h(
        'div',
        { className: 'aps-multipart' },
        h('input', { type: 'file', ref: fileRef, style: { display: 'none' }, onChange: handleFile }),
        fileError ? h(Notice, { tone: 'bad' }, fileError) : null,
        (fields || []).map((entry, index) => h(
          'div',
          { className: 'aps-multipart-row', key: index },
          h(TextInput, { className: 'aps-multipart-key', value: entry.key ?? '', onChange: (value) => update(index, { key: value }), placeholder: 'name', mono: true }),
          entry.type === 'file'
            ? h('span', { className: 'aps-multipart-file' }, entry.filename ? `${entry.filename}` : t('request.noFile'))
            : h(TextInput, { className: 'aps-multipart-value', value: entry.value ?? '', onChange: (value) => update(index, { value }), placeholder: 'value', mono: true }),
          h(Button, { size: 'small', tone: 'ghost', icon: 'plus', onClick: () => choose(index) }, t('request.chooseFile')),
          h(IconButton, { name: 'trash', title: t('common.remove'), onClick: () => onChange((fields || []).filter((_item, position) => position !== index)) }),
        )),
        h(
          'div',
          { className: 'aps-field-row' },
          h(Button, { size: 'small', tone: 'ghost', icon: 'plus', onClick: () => onChange([...(fields || []), { key: '', value: '', enabled: true, type: 'text' }]) }, t('request.addField')),
          h(Button, { size: 'small', tone: 'ghost', icon: 'plus', onClick: () => onChange([...(fields || []), { key: '', value: '', enabled: true, type: 'file' }]) }, t('request.addFile')),
        ),
      )
    }

    function RequestEditor({ draft, setDraft, dirty, onSave, onDelete, onSend, onHistory, onCases, onRelations, onVars, onDuplicate, running, saving, response, mockBase, sessionId, environments = [], activeEnvironmentId, runEnvironmentId = '', onRunEnvironment, t }) {
      const [tab, setTab] = React.useState('params')
      React.useEffect(() => {
        if (dirty && tab === 'params' && draft) {
          // keep the current tab; this effect intentionally only reacts to selection changes
        }
      }, [draft?.id])
      const patch = (value) => setDraft({ ...draft, ...value })
      const bodyTypeOptions = [
        { value: 'none', label: t('request.bodyNone') },
        { value: 'json', label: t('request.bodyJson') },
        { value: 'text', label: t('request.bodyText') },
        { value: 'form', label: t('request.bodyForm') },
        { value: 'multipart', label: t('request.bodyMultipart') },
      ]
      const formatBody = () => {
        try {
          const parsed = JSON.parse(draft.body?.text ?? '')
          setDraft({ ...draft, body: { ...draft.body, text: JSON.stringify(parsed, null, 2) } })
        } catch {
          // Keep invalid JSON untouched; the Host will report it if it matters.
        }
      }
      const auth = draft.auth || { type: 'none' }
      const mock = draft.mock || { enabled: false, status: 200, delayMs: 0, headers: [], body: '' }
      const [mockCopied, setMockCopied] = React.useState(false)
      const [pathCopied, setPathCopied] = React.useState(false)
      const updateMockConditions = (source, rows) => {
        const conditions = (mock.conditions || []).filter((entry) => entry.source !== source)
        patch({ mock: { ...mock, conditions: [...conditions, ...rows.map((entry) => ({ ...entry, source }))] } })
      }
      const copyPathUrl = async () => {
        if (!mock.path || !mockBase) return
        const url = `${mockBase}/path?path=${encodeURIComponent(mock.path)}&method=${encodeURIComponent((draft.method || 'GET').toUpperCase())}${sessionId ? `&sessionId=${encodeURIComponent(sessionId)}` : ''}`
        try {
          await navigator.clipboard.writeText(url)
          setPathCopied(true)
          window.setTimeout(() => setPathCopied(false), 1600)
        } catch {}
      }
      const copyMockUrl = async () => {
        if (!draft.id || !mockBase) return
        const url = `${mockBase}/${encodeURIComponent(draft.id)}${sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : ''}`
        try {
          await navigator.clipboard.writeText(url)
          setMockCopied(true)
          window.setTimeout(() => setMockCopied(false), 1600)
        } catch {
          // Clipboard may be unavailable; the URL is still shown in the button title.
        }
      }
      return h(
        'div',
        { className: 'aps-editor-card aps-card' },
        h(
          'div',
          { className: 'aps-request-head' },
          h(
            'div',
            { className: 'aps-name-row' },
            h(TextInput, { className: 'aps-name-field', style: { flex: 1 }, value: draft.name ?? '', placeholder: t('request.name'), onChange: (value) => patch({ name: value }) }),
            dirty ? h('span', { className: 'aps-dirty' }, t('request.unsaved')) : null,
            draft.id ? h(IconButton, { name: 'braces', onClick: onVars, title: t('inspect.title') }) : null,
            draft.id ? h(IconButton, { name: 'copy', onClick: onDuplicate, title: t('request.duplicate') }) : null,
            draft.id ? h(IconButton, { name: 'link', onClick: onRelations, title: t('relations.title') }) : null,
            draft.id ? h(IconButton, { name: 'cases', onClick: onCases, title: t('cases.title') }) : null,
            draft.id ? h(IconButton, { name: 'history', onClick: onHistory, title: t('history.title') }) : null,
            draft.id ? h(IconButton, { name: 'copy', onClick: onDuplicate, title: t('flow.duplicate') }) : null,
            draft.id ? h(IconButton, { name: 'trash', onClick: onDelete, title: t('common.delete') }) : null,
          ),
          h(
            'div',
            { className: 'aps-url-row' },
            h(Select, {
              className: 'aps-select method',
              value: draft.method || 'GET',
              onChange: (value) => patch({ method: value }),
              options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map((value) => ({ value, label: value })),
            }),
            h(TextInput, {
              className: 'aps-url-field',
              style: { flex: 1 },
              mono: true,
              value: draft.url ?? '',
              placeholder: t('request.urlPlaceholder'),
              onChange: (value) => patch({ url: value }),
            }),
            environments.length > 1 ? h(Select, {
              className: 'aps-select aps-run-env',
              value: runEnvironmentId || '',
              onChange: onRunEnvironment,
              title: t('run.environment'),
              options: [{ value: '', label: `${t('run.activeEnvironment')}: ${environments.find((entry) => entry.id === activeEnvironmentId)?.name || 'Default'}` }, ...environments.map((entry) => ({ value: entry.id, label: entry.name }))],
            }) : null,
            h(IconButton, { name: 'play', title: running ? t('common.running') : t('request.send'), onClick: onSend, disabled: running }),
            h(IconButton, { name: 'save', title: t('common.save'), onClick: onSave, disabled: saving }),
          ),
          h(
            'div',
            { className: 'aps-meta-row' },
            h('span', null, `${t('request.folder')}:`),
            h(TextInput, {
              style: { width: 82 },
              value: draft.folder ?? '',
              placeholder: t('collection.root'),
              onChange: (value) => patch({ folder: value }),
            }),
            h('span', null, `${t('request.timeout')}:`),
            h(TextInput, {
              style: { width: 90 },
              type: 'number',
              min: 1000,
              max: 120000,
              step: 1000,
              value: draft.timeoutMs ?? 30000,
              onChange: (value) => patch({ timeoutMs: Number(value) || 30000 }),
            }),
            h(Checkbox, { checked: draft.followRedirects !== false, onChange: (value) => patch({ followRedirects: value }), label: t('request.followRedirects') }),
            response ? h(Pill, { tone: statusTone(response) }, response.passed ? t('run.passed') : t('run.failed')) : null,
            response?.response?.status ? h('span', { className: 'aps-mono' }, `${response.response.status} · ${fmtDuration(response.response.durationMs)}`) : null,
          ),
        ),
        h(DshSegmentedTabs, {
          className: 'aps-request-tabs',
          label: t('request.name'),
          items: [
            { value: 'params', label: t('request.params') },
            { value: 'headers', label: t('request.headers') },
            { value: 'body', label: t('request.body') },
            { value: 'auth', label: t('request.auth') },
            { value: 'tests', label: t('request.tests') },
            { value: 'mock', label: t('request.mock') },
            { value: 'scripts', label: t('request.scripts') },
          ],
          value: tab,
          onChange: setTab,
        }),
        h(
          'div',
          { className: 'aps-tab-body' },
          tab === 'params'
            ? h(ValueTable, { rows: draft.query, onChange: (value) => patch({ query: value }), addLabel: t('request.addParam'), keyPlaceholder: 'key', valuePlaceholder: 'value' })
            : null,
          tab === 'headers'
            ? h(
                'div',
                { style: { display: 'flex', flexDirection: 'column', gap: 10 } },
                h(ValueTable, { rows: draft.headers, onChange: (value) => patch({ headers: value }), addLabel: t('request.addHeader'), keyPlaceholder: 'Header-Name', valuePlaceholder: 'value' }),
                h('div', { className: 'aps-section-title' }, t('request.cookies')),
                h(ValueTable, { rows: draft.cookies || [], onChange: (value) => patch({ cookies: value }), addLabel: t('request.addHeader'), keyPlaceholder: 'cookie-name', valuePlaceholder: 'value' }),
              )
            : null,
          tab === 'body'
            ? h(
                'div',
                { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
                h(
                  'div',
                  { className: 'aps-field-row' },
                  h(Field, { label: t('request.bodyType') }, h(Select, { value: draft.body?.type ?? 'none', onChange: (value) => patch({ body: { ...(draft.body || {}), type: value } }), options: bodyTypeOptions })),
                  draft.body?.type === 'json' ? h(Button, { size: 'small', tone: 'ghost', onClick: formatBody }, t('common.format')) : null,
                  h('span', { className: 'aps-muted', style: { fontSize: 10.5 } }, '{{variable}}'),
                ),
                draft.body?.type === 'multipart'
                  ? h(
                      'div',
                      null,
                      h('div', { className: 'aps-section-title' }, t('request.formFields')),
                      h(MultipartFields, { fields: draft.body?.fields || [], onChange: (value) => patch({ body: { ...(draft.body || {}), fields: value } }), t }),
                    )
                  : draft.body?.type === 'form'
                    ? h(
                        'div',
                        null,
                        h('div', { className: 'aps-section-title' }, t('request.formFields')),
                        h(ValueTable, { rows: draft.body?.fields || [], onChange: (value) => patch({ body: { ...(draft.body || {}), fields: value } }), addLabel: t('request.addParam'), keyPlaceholder: 'key', valuePlaceholder: 'value' }),
                      )
                    : null,
                draft.body?.type === 'none'
                  ? h('div', { className: 'aps-muted', style: { fontSize: 11.5 } }, t('request.bodyNone'))
                  : h(TextArea, {
                      value: draft.body?.text ?? '',
                      onChange: (value) => patch({ body: { ...(draft.body || {}), text: value } }),
                      rows: 14,
                      mono: true,
                      className: 'tall',
                      placeholder: draft.body?.type === 'json' ? '{\n  "name": "value"\n}' : '',
                      language: draft.body?.type === 'json' ? 'json' : 'plaintext',
                    }),
              )
            : null,
          tab === 'auth'
            ? h(
                'div',
                { className: 'aps-form-grid' },
                h(Field, { label: t('request.authType') }, h(Select, {
                  value: auth.type || 'none',
                  onChange: (value) => patch({ auth: { ...auth, type: value } }),
                  options: [
                    { value: 'none', label: t('request.authNone') },
                    { value: 'bearer', label: t('request.authBearer') },
                    { value: 'basic', label: t('request.authBasic') },
                    { value: 'apiKey', label: t('request.authApiKey') },
                    { value: 'oauth2', label: t('request.authOAuth2') },
                    { value: 'digest', label: t('request.authDigest') },
                    { value: 'oauth1', label: t('request.authOAuth1') },
                    { value: 'hawk', label: t('request.authHawk') },
                    { value: 'aws', label: t('request.authAws') },
                  ],
                })),
                auth.type === 'bearer' ? h(Field, { label: t('request.token') }, h(TextInput, { value: auth.token ?? '', onChange: (value) => patch({ auth: { ...auth, token: value } }), mono: true, placeholder: '{{token}}' })) : null,
                auth.type === 'basic' || auth.type === 'digest' ? h(Field, { label: t('request.username') }, h(TextInput, { value: auth.username ?? '', onChange: (value) => patch({ auth: { ...auth, username: value } }), mono: true })) : null,
                auth.type === 'basic' || auth.type === 'digest' ? h(Field, { label: t('request.password') }, h(TextInput, { type: 'password', value: auth.password ?? '', onChange: (value) => patch({ auth: { ...auth, password: value } }), mono: true })) : null,
                auth.type === 'apiKey' ? h(Field, { label: t('request.key') }, h(TextInput, { value: auth.key ?? '', onChange: (value) => patch({ auth: { ...auth, key: value } }), mono: true, placeholder: 'X-API-Key' })) : null,
                auth.type === 'apiKey' ? h(Field, { label: t('request.value') }, h(TextInput, { value: auth.value ?? '', onChange: (value) => patch({ auth: { ...auth, value: value } }), mono: true })) : null,
                auth.type === 'apiKey' ? h(Field, { label: t('request.in') }, h(Select, { value: auth.in ?? 'header', onChange: (value) => patch({ auth: { ...auth, in: value } }), options: [{ value: 'header', label: t('request.header') }, { value: 'query', label: t('request.query') }] })) : null,
                auth.type === 'aws' ? h(Field, { label: t('request.awsAccessKey') }, h(TextInput, { value: auth.awsAccessKey ?? '', onChange: (value) => patch({ auth: { ...auth, awsAccessKey: value } }), mono: true })) : null,
                auth.type === 'aws' ? h(Field, { label: t('request.awsSecretKey') }, h(TextInput, { type: 'password', value: auth.awsSecretKey ?? '', onChange: (value) => patch({ auth: { ...auth, awsSecretKey: value } }), mono: true })) : null,
                auth.type === 'aws' ? h(Field, { label: t('request.awsRegion') }, h(TextInput, { value: auth.awsRegion ?? 'us-east-1', onChange: (value) => patch({ auth: { ...auth, awsRegion: value } }), mono: true })) : null,
                auth.type === 'aws' ? h(Field, { label: t('request.awsService') }, h(TextInput, { value: auth.awsService ?? 'execute-api', onChange: (value) => patch({ auth: { ...auth, awsService: value } }), mono: true })) : null,
                auth.type === 'aws' ? h(Field, { label: t('request.awsSessionToken') }, h(TextInput, { value: auth.awsSessionToken ?? '', onChange: (value) => patch({ auth: { ...auth, awsSessionToken: value } }), mono: true })) : null,
                auth.type === 'hawk' ? h(Field, { label: t('request.hawkId') }, h(TextInput, { value: auth.hawkId ?? '', onChange: (value) => patch({ auth: { ...auth, hawkId: value } }), mono: true })) : null,
                auth.type === 'hawk' ? h(Field, { label: t('request.hawkKey') }, h(TextInput, { type: 'password', value: auth.hawkKey ?? '', onChange: (value) => patch({ auth: { ...auth, hawkKey: value } }), mono: true })) : null,
                auth.type === 'hawk' ? h(Field, { label: t('request.hawkAlgorithm') }, h(Select, { value: auth.hawkAlgorithm ?? 'sha256', onChange: (value) => patch({ auth: { ...auth, hawkAlgorithm: value } }), options: [{ value: 'sha256', label: 'SHA-256' }, { value: 'sha1', label: 'SHA-1' }] })) : null,
                auth.type === 'hawk' ? h(Field, { label: t('request.hawkExt') }, h(TextInput, { value: auth.hawkExt ?? '', onChange: (value) => patch({ auth: { ...auth, hawkExt: value } }), mono: true })) : null,
                auth.type === 'hawk' ? h(Field, { label: t('request.hawkPayloadHash') }, h(Checkbox, { checked: auth.hawkPayloadHash === true, onChange: (value) => patch({ auth: { ...auth, hawkPayloadHash: value } }), label: '' })) : null,
                auth.type === 'oauth1' ? h(Field, { label: t('request.oauthConsumerKey') }, h(TextInput, { value: auth.consumerKey ?? '', onChange: (value) => patch({ auth: { ...auth, consumerKey: value } }), mono: true })) : null,
                auth.type === 'oauth1' ? h(Field, { label: t('request.oauthConsumerSecret') }, h(TextInput, { type: 'password', value: auth.consumerSecret ?? '', onChange: (value) => patch({ auth: { ...auth, consumerSecret: value } }), mono: true })) : null,
                auth.type === 'oauth1' ? h(Field, { label: t('request.oauthToken') }, h(TextInput, { value: auth.oauthToken ?? '', onChange: (value) => patch({ auth: { ...auth, oauthToken: value } }), mono: true })) : null,
                auth.type === 'oauth1' ? h(Field, { label: t('request.oauthTokenSecret') }, h(TextInput, { type: 'password', value: auth.oauthTokenSecret ?? '', onChange: (value) => patch({ auth: { ...auth, oauthTokenSecret: value } }), mono: true })) : null,
                auth.type === 'oauth1' ? h(Field, { label: t('request.oauthSignatureMethod') }, h(Select, { value: auth.signatureMethod ?? 'HMAC-SHA1', onChange: (value) => patch({ auth: { ...auth, signatureMethod: value } }), options: [{ value: 'HMAC-SHA1', label: 'HMAC-SHA1' }, { value: 'PLAINTEXT', label: 'PLAINTEXT' }] })) : null,
                auth.type === 'oauth1' ? h(Field, { label: t('request.oauthRealm') }, h(TextInput, { value: auth.realm ?? '', onChange: (value) => patch({ auth: { ...auth, realm: value } }), mono: true })) : null,
                auth.type === 'oauth2' ? h(Field, { label: t('request.oauthTokenUrl') }, h(TextInput, { value: auth.tokenUrl ?? '', onChange: (value) => patch({ auth: { ...auth, tokenUrl: value } }), mono: true, placeholder: 'https://auth.example.com/oauth/token' })) : null,
                auth.type === 'oauth2' ? h(Field, { label: t('request.oauthClientId') }, h(TextInput, { value: auth.clientId ?? '', onChange: (value) => patch({ auth: { ...auth, clientId: value } }), mono: true })) : null,
                auth.type === 'oauth2' ? h(Field, { label: t('request.oauthClientSecret') }, h(TextInput, { type: 'password', value: auth.clientSecret ?? '', onChange: (value) => patch({ auth: { ...auth, clientSecret: value } }), mono: true })) : null,
                auth.type === 'oauth2' ? h(Field, { label: t('request.oauthScope') }, h(TextInput, { value: auth.scope ?? '', onChange: (value) => patch({ auth: { ...auth, scope: value } }), mono: true, placeholder: 'read write' })) : null,
                auth.type === 'oauth2' ? h(Field, { label: t('request.oauthClientAuth') }, h(Select, { value: auth.clientAuth ?? 'body', onChange: (value) => patch({ auth: { ...auth, clientAuth: value } }), options: [{ value: 'body', label: 'Body' }, { value: 'basic', label: 'Basic Auth' }] })) : null,
              )
            : null,
          tab === 'tests' ? h(TestEditor, { tests: draft.tests, onChange: (value) => patch({ tests: value }), t }) : null,
          tab === 'scripts'
            ? h(
                'div',
                { className: 'aps-scripts-panel' },
                h(Field, { label: t('request.preScript') }, h(TextArea, {
                  value: draft.preScript ?? '',
                  onChange: (value) => patch({ preScript: value }),
                  rows: 6,
                  language: 'javascript',
                  mono: true,
                  placeholder: "pm.variables.set('timestamp', Date.now());",
                })),
                h(Field, { label: t('request.postScript') }, h(TextArea, {
                  value: draft.postScript ?? '',
                  onChange: (value) => patch({ postScript: value }),
                  rows: 6,
                  language: 'javascript',
                  mono: true,
                  placeholder: "pm.variables.set('token', pm.response.json().token);",
                })),
                h('div', { className: 'aps-project-hint' }, t('request.scriptHint')),
              )
            : null,
          tab === 'mock'
            ? h(
                'div',
                { className: 'aps-mock-panel' },
                h('div', { className: 'aps-field-row' }, h(Checkbox, { checked: mock.enabled === true, onChange: (value) => patch({ mock: { ...mock, enabled: value } }), label: t('mock.enabled') }), h(Checkbox, { checked: mock.smart === true, onChange: (value) => patch({ mock: { ...mock, smart: value } }), label: t('mock.smart') })),
                h('div', { className: 'aps-muted', style: { fontSize: 11 } }, t('mock.smartHint')),
                h(Field, { label: t('mock.schema') }, h(JsonObjectField, { value: mock.schema || {}, onChange: (value) => patch({ mock: { ...mock, schema: value } }), onApply: (value) => patch({ mock: { ...mock, schema: value } }), applyLabel: t('common.apply'), rows: 5 })),
                h(Field, { label: t('mock.path') }, h(TextInput, { value: mock.path ?? '', onChange: (value) => patch({ mock: { ...mock, path: value } }), mono: true, placeholder: '/users/:id' })),
                h('div', { className: 'aps-muted', style: { fontSize: 11 } }, t('mock.pathHint')),
                h('div', { className: 'aps-section-title' }, t('mock.conditions')),
                h('div', { className: 'aps-field-label' }, t('mock.queryConditions')),
                h(ValueTable, { rows: (mock.conditions || []).filter((entry) => entry.source === 'query'), onChange: (value) => updateMockConditions('query', value), addLabel: t('request.addParam'), keyPlaceholder: 'status', valuePlaceholder: 'ok' }),
                h('div', { className: 'aps-field-label' }, t('mock.headerConditions')),
                h(ValueTable, { rows: (mock.conditions || []).filter((entry) => entry.source === 'header'), onChange: (value) => updateMockConditions('header', value), addLabel: t('request.addHeader'), keyPlaceholder: 'x-tenant', valuePlaceholder: 'airpost' }),
                h('div', { className: 'aps-muted', style: { fontSize: 11 } }, t('mock.conditionHint')),
                h(
                  'div',
                  { className: 'aps-form-grid' },
                  h(Field, { label: t('mock.status') }, h(TextInput, { type: 'number', min: 100, max: 599, value: mock.status ?? 200, onChange: (value) => patch({ mock: { ...mock, status: Number(value) || 200 } }) })),
                  h(Field, { label: t('mock.delay') }, h(TextInput, { type: 'number', min: 0, max: 60000, step: 100, value: mock.delayMs ?? 0, onChange: (value) => patch({ mock: { ...mock, delayMs: Number(value) || 0 } }) })),
                ),
                h('div', { className: 'aps-section-title' }, `${t('mock.examples')} (${(draft.examples || []).length})`),
                (draft.examples || []).length === 0
                  ? h('div', { className: 'aps-muted', style: { fontSize: 11 } }, t('mock.noExamples'))
                  : h(
                      'div',
                      { className: 'aps-cases-list' },
                      (draft.examples || []).map((example) => h(
                        'div',
                        { className: `aps-history-row ${mock.exampleId === example.id ? 'active' : ''}`, key: example.id },
                        h(Pill, { tone: 'neutral' }, String(example.status)),
                        h('span', { className: 'aps-history-main' }, h('span', { className: 'aps-history-name' }, example.name), h('span', { className: 'aps-history-meta' }, truncate(example.body || '', 120))),
                        h(Button, { size: 'small', tone: 'ghost', onClick: () => patch({ mock: { ...mock, exampleId: example.id } }), disabled: mock.exampleId === example.id }, mock.exampleId === example.id ? t('mock.selectedExample') : t('mock.useExample')),
                        h(IconButton, { name: 'trash', title: t('common.remove'), onClick: () => patch({ examples: (draft.examples || []).filter((entry) => entry.id !== example.id) }) }),
                      )),
                    ),
                h('div', { className: 'aps-muted', style: { fontSize: 11 } }, t('mock.exampleHint')),
                h('div', { className: 'aps-field-label' }, t('mock.headers')),
                h(ValueTable, { rows: mock.headers || [], onChange: (value) => patch({ mock: { ...mock, headers: value } }), addLabel: t('request.addHeader'), keyPlaceholder: 'Header-Name', valuePlaceholder: 'value' }),
                h(Field, { label: t('mock.body') }, h(TextArea, { value: mock.body ?? '', onChange: (value) => patch({ mock: { ...mock, body: value } }), rows: 8, language: 'json', mono: true, placeholder: '{\n  "ok": true\n}' })),
                h('div', { className: 'aps-field-row' },
                  h(Button, { size: 'small', tone: 'ghost', icon: 'copy', onClick: copyMockUrl, disabled: !draft.id || !mockBase, title: draft.id && mockBase ? `${mockBase}/${encodeURIComponent(draft.id)}` : t('mock.hint') }, mockCopied ? t('mock.copied') : t('mock.copyUrl')),
                  h(Button, { size: 'small', tone: 'ghost', icon: 'link', onClick: copyPathUrl, disabled: !mock.path || !mockBase }, pathCopied ? t('mock.pathCopied') : t('mock.copyPathUrl')),
                  h('span', { className: 'aps-muted', style: { fontSize: 11 } }, t('mock.hint')),
                ),
              )
            : null,
        ),
      )
    }

    function diffLines(left, right) {
      const a = String(left ?? '').split('\n').slice(0, 400)
      const b = String(right ?? '').split('\n').slice(0, 400)
      const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
      for (let i = a.length - 1; i >= 0; i -= 1) {
        for (let j = b.length - 1; j >= 0; j -= 1) {
          dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
        }
      }
      const result = []
      let i = 0
      let j = 0
      while (i < a.length && j < b.length) {
        if (a[i] === b[j]) { result.push({ type: 'same', text: a[i] }); i += 1; j += 1 }
        else if (dp[i + 1][j] >= dp[i][j + 1]) { result.push({ type: 'del', text: a[i] }); i += 1 }
        else { result.push({ type: 'add', text: b[j] }); j += 1 }
      }
      while (i < a.length) { result.push({ type: 'del', text: a[i] }); i += 1 }
      while (j < b.length) { result.push({ type: 'add', text: b[j] }); j += 1 }
      return result
    }

    function diffCharSegments(left, right) {
      const a = String(left ?? '')
      const b = String(right ?? '')
      let prefix = 0
      while (prefix < a.length && prefix < b.length && a[prefix] === b[prefix]) prefix += 1
      let suffix = 0
      while (suffix < a.length - prefix && suffix < b.length - prefix && a[a.length - 1 - suffix] === b[b.length - 1 - suffix]) suffix += 1
      const leftParts = []
      const rightParts = []
      if (prefix > 0) {
        leftParts.push({ text: a.slice(0, prefix), changed: false })
        rightParts.push({ text: b.slice(0, prefix), changed: false })
      }
      const leftMiddle = a.slice(prefix, a.length - suffix)
      const rightMiddle = b.slice(prefix, b.length - suffix)
      if (leftMiddle.length > 0) leftParts.push({ text: leftMiddle, changed: true })
      if (rightMiddle.length > 0) rightParts.push({ text: rightMiddle, changed: true })
      if (suffix > 0) {
        leftParts.push({ text: a.slice(a.length - suffix), changed: false })
        rightParts.push({ text: b.slice(b.length - suffix), changed: false })
      }
      return { left: leftParts, right: rightParts }
    }

    function ResponseDiffModal({ previous, current, onClose, t }) {
      const [mode, setMode] = React.useState('unified')
      const [diffIndex, setDiffIndex] = React.useState(0)
      const left = previous?.response?.json !== undefined ? pretty(previous.response.json) : previous?.response?.body ?? ''
      const right = current?.response?.json !== undefined ? pretty(current.response.json) : current?.response?.body ?? ''
      const lines = diffLines(left, right)
      const changed = lines.some((line) => line.type !== 'same')
      const previousHeaders = previous?.response?.headers ?? {}
      const currentHeaders = current?.response?.headers ?? {}
      const headerKeys = [...new Set([...Object.keys(previousHeaders), ...Object.keys(currentHeaders)])].sort()
      const headerRows = headerKeys.map((key) => ({ key, previous: previousHeaders[key], current: currentHeaders[key], changed: String(previousHeaders[key] ?? '') !== String(currentHeaders[key] ?? '') })).filter((row) => row.changed)
      let leftNo = 0
      let rightNo = 0
      const numberedLines = lines.map((line) => {
        if (line.type === 'same') { leftNo += 1; rightNo += 1; return { ...line, leftNo, rightNo } }
        if (line.type === 'del') { leftNo += 1; return { ...line, leftNo } }
        rightNo += 1
        return { ...line, rightNo }
      })
      const splitRows = numberedLines.map((line, index) => ({
        index,
        ...(line.type === 'same'
          ? { left: line.text, right: line.text, type: 'same', leftNo: line.leftNo, rightNo: line.rightNo }
          : line.type === 'del'
            ? { left: line.text, right: '', type: 'del', leftNo: line.leftNo }
            : { left: '', right: line.text, type: 'add', rightNo: line.rightNo }),
      }))
      const changedIndices = numberedLines.map((line, index) => line.type === 'same' ? -1 : index).filter((index) => index >= 0)
      const charPairs = new Map()
      for (let index = 0; index < numberedLines.length - 1; index += 1) {
        if (numberedLines[index].type === 'del' && numberedLines[index + 1].type === 'add') {
          const pair = diffCharSegments(numberedLines[index].text, numberedLines[index + 1].text)
          charPairs.set(index, pair.left)
          charPairs.set(index + 1, pair.right)
          index += 1
        }
      }
      const segmentsFor = (index, type) => charPairs.get(index) ?? [{ text: numberedLines[index]?.text ?? '', changed: type !== 'same' }]
      const displayLines = numberedLines.map((line, index) => ({ ...line, sourceIndex: index })).filter((line) => !onlyChanged || line.type !== 'same')
      const displayItems = (() => {
        if (onlyChanged || !foldSame) return displayLines.map((line) => ({ kind: 'line', line }))
        const items = []
        let index = 0
        while (index < numberedLines.length) {
          if (numberedLines[index].type !== 'same') {
            items.push({ kind: 'line', line: { ...numberedLines[index], sourceIndex: index } })
            index += 1
            continue
          }
          let end = index
          while (end < numberedLines.length && numberedLines[end].type === 'same') end += 1
          const count = end - index
          if (count > 3 && !expandedRuns.has(index)) items.push({ kind: 'fold', start: index, count })
          else for (let position = index; position < end; position += 1) items.push({ kind: 'line', line: { ...numberedLines[position], sourceIndex: position } })
          index = end
        }
        return items
      })()
      const [diffCopied, setDiffCopied] = React.useState(false)
      const [onlyChanged, setOnlyChanged] = React.useState(false)
      const [foldSame, setFoldSame] = React.useState(() => { try { return window.localStorage.getItem('airpost.diff.foldSame') === '1' } catch { return false } })
      const updateFoldSame = (value) => { setFoldSame(value); try { window.localStorage.setItem('airpost.diff.foldSame', value ? '1' : '0') } catch {} }
      const [expandedRuns, setExpandedRuns] = React.useState(() => new Set())
      const copyDiff = async () => {
        const text = numberedLines.map((line) => `${line.type === 'add' ? '+' : line.type === 'del' ? '-' : ' '} ${line.text}`).join('\n')
        try {
          await navigator.clipboard.writeText(text)
          setDiffCopied(true)
          window.setTimeout(() => setDiffCopied(false), 1500)
        } catch {}
      }
      const goDiff = (delta) => {
        if (changedIndices.length === 0) return
        const next = (diffIndex + delta + changedIndices.length) % changedIndices.length
        setDiffIndex(next)
        window.requestAnimationFrame(() => document.getElementById(`diff-line-${changedIndices[next]}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }))
      }
      return h(
        DshModal,
        { open: true, onClose, title: t('run.compare'), closeLabel: t('common.close') },
        h(
          'div',
          { className: 'aps-diff' },
          h(
            'div',
            { className: 'aps-diff-head' },
            h('div', null, h('div', { className: 'aps-section-title' }, t('run.previous')), h('span', { className: 'aps-muted' }, previous?.title || previous?.id || '—')),
            h('div', null, h('div', { className: 'aps-section-title' }, t('run.current')), h('span', { className: 'aps-muted' }, current?.title || current?.id || '—')),
          ),
          h('div', { className: 'aps-diff-meta' }, h('span', null, `${t('run.compareBodies')} · ${previous?.response?.status ?? '—'} → ${current?.response?.status ?? '—'} · ${fmtDuration(previous?.response?.durationMs)} → ${fmtDuration(current?.response?.durationMs)}`), h('span', { className: 'aps-tab-spacer' }), h(DshSegmentedTabs, { className: 'aps-diff-tabs', label: t('run.compareBodies'), items: [{ value: 'unified', label: t('run.unified') }, { value: 'split', label: t('run.split') }], value: mode, onChange: setMode }), h(Checkbox, { checked: onlyChanged, onChange: setOnlyChanged, label: t('run.onlyChanged') }), h(Checkbox, { checked: foldSame, onChange: updateFoldSame, disabled: onlyChanged, label: t('run.foldSame') }), foldSame && expandedRuns.size > 0 ? h(Button, { size: 'small', tone: 'ghost', onClick: () => setExpandedRuns(new Set()) }, t('run.collapseAll')) : null, h(IconButton, { name: 'copy', title: diffCopied ? t('run.diffCopied') : t('run.copyDiff'), onClick: copyDiff }), changedIndices.length > 0 ? h('span', { className: 'aps-diff-nav' }, h(IconButton, { name: 'up', title: 'Previous difference', onClick: () => goDiff(-1) }), h('span', { className: 'aps-muted', style: { fontSize: 10 } }, `${diffIndex + 1}/${changedIndices.length}`), h(IconButton, { name: 'down', title: 'Next difference', onClick: () => goDiff(1) })) : null),
          headerRows.length > 0
            ? h(
                'div',
                { className: 'aps-diff-headers' },
                h('div', { className: 'aps-section-title' }, t('run.headerDiff')),
                h('table', { className: 'aps-table' }, h('thead', null, h('tr', null, h('th', null, 'Name'), h('th', null, t('run.previous')), h('th', null, t('run.current')))), h('tbody', null, headerRows.map((row) => h('tr', { key: row.key, className: 'aps-diff-header-row' }, h('td', { className: 'aps-mono' }, row.key), h('td', { className: 'aps-mono aps-diff-old' }, String(row.previous ?? '—')), h('td', { className: 'aps-mono aps-diff-new' }, String(row.current ?? '—')))))),
              )
            : null,
          changed
            ? mode === 'split'
              ? h(
                  'div',
                  { className: 'aps-diff-split' },
                  h('div', { className: 'aps-diff-split-row head' }, h('span', null, t('run.previous')), h('span', null, t('run.current'))),
                  splitRows.filter((line) => !onlyChanged || line.type !== 'same').map((line) => h('div', { className: `aps-diff-split-row ${line.type} ${line.type !== 'same' && changedIndices[diffIndex] === line.index ? 'current' : ''}`, key: line.index, id: `diff-line-${line.index}` }, h('span', { className: 'aps-diff-split-cell' }, h('span', { className: 'aps-diff-no' }, line.leftNo ?? ''), (line.type === 'add' ? [] : segmentsFor(line.index, line.type)).map((segment, partIndex) => h('span', { key: partIndex, className: segment.changed ? 'aps-diff-char' : '' }, segment.text))), h('span', { className: 'aps-diff-split-cell' }, h('span', { className: 'aps-diff-no' }, line.rightNo ?? ''), (line.type === 'del' ? [] : segmentsFor(line.index, line.type)).map((segment, partIndex) => h('span', { key: partIndex, className: segment.changed ? 'aps-diff-char' : '' }, segment.text))))),
                )
              : h('div', { className: 'aps-diff-lines' }, displayItems.map((item) => item.kind === 'fold' ? h('div', { className: 'aps-diff-fold', key: `fold-${item.start}` }, h(Button, { size: 'small', tone: 'ghost', onClick: () => setExpandedRuns((current) => new Set([...current, item.start])) }, `⋯ ${item.count} ${t('run.unchangedLines')}`)) : h('div', { className: `aps-diff-line ${item.line.type} ${item.line.type !== 'same' && changedIndices[diffIndex] === item.line.sourceIndex ? 'current' : ''}`, key: item.line.sourceIndex, id: `diff-line-${item.line.sourceIndex}` }, h('span', { className: 'aps-diff-no' }, item.line.leftNo ?? ''), h('span', { className: 'aps-diff-no' }, item.line.rightNo ?? ''), h('span', { className: 'aps-diff-sign' }, item.line.type === 'add' ? '+' : item.line.type === 'del' ? '-' : ' '), h('span', { className: 'aps-diff-text' }, segmentsFor(item.line.sourceIndex, item.line.type).map((segment, partIndex) => h('span', { key: partIndex, className: segment.changed ? 'aps-diff-char' : '' }, segment.text))))))
            : h('div', { className: 'aps-muted', style: { padding: '10px 0' } }, t('run.noDiff')),
        ),
      )
    }

    function jsonAtPath(value, path) {
      const parts = String(path ?? '').replace(/^\$\.?/, '').replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean)
      let current = value
      for (const part of parts) {
        if (current === undefined || current === null) return undefined
        current = current[part]
      }
      return current
    }

    function CodeSnippetModal({ request, variables = {}, t, onClose }) {
      const [kind, setKind] = React.useState('fetch')
      const [copied, setCopied] = React.useState(false)
      const [resolve, setResolve] = React.useState(false)
      const resolveText = (value) => {
        const text = String(value ?? '')
        if (!resolve) return text
        return text.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (match, name) => Object.prototype.hasOwnProperty.call(variables, name) ? String(variables[name]) : match)
      }
      const url = resolveText(request?.url ?? '')
      const headers = Object.fromEntries(Object.entries(request?.headers ?? {}).map(([key, value]) => [resolveText(key), resolveText(value)]))
      const body = request?.body && !String(request.body).startsWith('[') ? resolveText(request.body) : undefined
      const curlQuote = (value) => `'${String(value ?? '').replace(/'/g, `'\\''`)}'`
      const curl = request ? [`curl -X ${request.method} ${curlQuote(url)}`, ...Object.entries(headers).map(([key, value]) => `-H ${curlQuote(`${key}: ${value}`)}`), ...(body ? [`--data-raw ${curlQuote(body)}`] : [])].join(' \\\n  ') : ''
      const fetchCode = request ? `const response = await fetch(${JSON.stringify(url)}, {\n  method: ${JSON.stringify(request.method)},\n  headers: ${JSON.stringify(headers, null, 2)},${body ? `\n  body: ${JSON.stringify(body)},` : ''}\n});\nconst data = await response.json();` : ''
      const axiosCode = request ? `import axios from 'axios';\n\nconst response = await axios.request({\n  method: ${JSON.stringify(request.method)},\n  url: ${JSON.stringify(url)},\n  headers: ${JSON.stringify(headers, null, 2)},${body ? `\n  data: ${JSON.stringify(body)},` : ''}\n});` : ''
      const pythonCode = request ? `import requests\n\nresponse = requests.request(\n    ${JSON.stringify(request.method)},\n    ${JSON.stringify(url)},\n    headers=${JSON.stringify(headers, null, 2)},${body ? `\n    data=${JSON.stringify(body)},` : ''}\n)\nprint(response.text)` : ''
      const goCode = request ? `package main\n\nimport (\n  "fmt"\n  "io"\n  "net/http"\n  "strings"\n)\n\nfunc main() {\n  req, _ := http.NewRequest(${JSON.stringify(request.method)}, ${JSON.stringify(url)}, strings.NewReader(${JSON.stringify(body || '')}))\n${Object.entries(headers).map(([key, value]) => `  req.Header.Set(${JSON.stringify(key)}, ${JSON.stringify(String(value))})`).join('\n')}\n  resp, _ := http.DefaultClient.Do(req)\n  defer resp.Body.Close()\n  data, _ := io.ReadAll(resp.Body)\n  fmt.Println(string(data))\n}` : ''
      const code = kind === 'fetch' ? fetchCode : kind === 'axios' ? axiosCode : kind === 'python' ? pythonCode : kind === 'go' ? goCode : curl
      const copy = async () => {
        try { await navigator.clipboard.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1500) } catch {}
      }
      const download = () => {
        const extension = kind === 'python' ? 'py' : kind === 'go' ? 'go' : kind === 'curl' ? 'sh' : 'js'
        const blob = new Blob([code], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `airpost-snippet.${extension}`
        document.body.append(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
      }
      return h(
        DshModal,
        { open: true, onClose, title: t('run.codeSnippet'), closeLabel: t('common.close') },
        h(
          'div',
          { className: 'aps-code-snippet' },
          h(DshSegmentedTabs, { label: t('run.codeSnippet'), items: [{ value: 'fetch', label: t('run.fetch') }, { value: 'axios', label: t('run.axios') }, { value: 'python', label: 'Python' }, { value: 'go', label: 'Go' }, { value: 'curl', label: 'cURL' }], value: kind, onChange: setKind }),
          h(TextArea, { value: code, readOnly: true, rows: 12, mono: true, language: kind === 'curl' ? 'plaintext' : kind === 'python' ? 'python' : kind === 'go' ? 'go' : 'javascript' }),
          h('div', { className: 'aps-project-actions' }, h(Checkbox, { checked: resolve, onChange: setResolve, label: t('run.resolveVariables') }), h('span', { className: 'aps-tab-spacer' }), h(Button, { size: 'small', icon: 'copy', onClick: copy }, copied ? t('run.codeCopied') : t('common.copy')), h(Button, { size: 'small', icon: 'download', onClick: download }, t('run.downloadSnippet'))),
        ),
      )
    }

    function ResponsePanel({ run, t, onApplyCookies, onSaveExample, onCompare }) {
      const [bodyMode, setBodyMode] = React.useState('pretty')
      const [jsonPath, setJsonPath] = React.useState('')
      const [bodyCopied, setBodyCopied] = React.useState(false)
      const [codeOpen, setCodeOpen] = React.useState(false)
      const [curlCopied, setCurlCopied] = React.useState(false)
      const copyAsCurl = async () => {
        const request = run?.request
        if (!request) return
        const quote = (value) => `'${String(value ?? '').replace(/'/g, `'\\''`)}'`
        const lines = [`curl -X ${request.method} ${quote(request.url)}`]
        for (const [key, value] of Object.entries(request.headers || {})) lines.push(`-H ${quote(`${key}: ${value}`)}`)
        if (request.body && !String(request.body).startsWith('[')) lines.push(`--data-raw ${quote(request.body)}`)
        try {
          await navigator.clipboard.writeText(lines.join(' \\\n  '))
          setCurlCopied(true)
          window.setTimeout(() => setCurlCopied(false), 1500)
        } catch {}
      }
      const downloadBody = () => {
        if (!response) return
        const extension = String(response.contentType || '').includes('json') ? 'json' : String(response.contentType || '').includes('html') ? 'html' : 'txt'
        const blob = new Blob([rawBody], { type: response.contentType || 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `airpost-response.${extension}`
        document.body.append(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
      }
      const [tab, setTab] = React.useState('body')
      const response = run?.response
      if (!run) {
        return h('div', { className: 'aps-response-card aps-card' }, h(Empty, { title: t('run.noResponse'), hint: t('run.emptyResponse') }))
      }
      const tests = Array.isArray(run.tests) ? run.tests : []
      const rawBody = response?.body ?? ''
      const bodyText = bodyMode === 'raw' ? rawBody : response?.json !== undefined ? pretty(response.json) : rawBody
      const pathValue = jsonPath.trim().length > 0 ? jsonAtPath(response?.json, jsonPath) : undefined
      const hasSchema = response?.json !== undefined
      const activeTab = tab === 'schema' && !hasSchema ? 'body' : tab
      const cookies = Array.isArray(response?.cookies) ? response.cookies : []
      const responseTabs = [
        ['body', t('run.body')],
        ['headers', t('run.headers')],
        ['tests', `${t('run.tests')} (${tests.filter((test) => test.passed).length}/${tests.length})`],
      ]
      if (hasSchema) responseTabs.push(['schema', t('run.schema')])
      if (cookies.length > 0) responseTabs.push(['cookies', `${t('run.cookies')} (${cookies.length})`])
      return h(
        'div',
        { className: 'aps-response-card aps-card' },
        h(
          'div',
          { className: 'aps-response-head' },
          h('span', { className: 'aps-response-title' }, t('run.response')),
          h(Pill, { tone: statusTone(run) }, run.passed ? t('run.passed') : t('run.failed')),
          response?.status ? h('span', { className: 'aps-mono', style: { fontSize: 11, fontWeight: 700 } }, String(response.status)) : null,
          h('span', { className: 'aps-response-meta' }, response ? `${fmtDuration(response.durationMs)} · ${fmtBytes(response.size)}` : '', run.error ? ` · ${run.error}` : ''),
          h('span', { className: 'aps-tab-spacer' }),
          onSaveExample ? h(IconButton, { name: 'save', title: t('mock.saveExample'), onClick: onSaveExample }) : null,
          onCompare ? h(IconButton, { name: 'history', title: t('run.comparePrevious'), onClick: onCompare }) : null,
          h(DshSegmentedTabs, {
            className: 'aps-response-tabs',
            label: t('run.response'),
            items: responseTabs.map(([value, label]) => ({ value, label })),
            value: activeTab,
            onChange: setTab,
          }),
        ),
        activeTab === 'body'
          ? h(
              'div',
              { className: 'aps-code-wrap' },
              run.error ? h(Notice, { tone: 'bad' }, run.error) : null,
              run.warnings?.length ? h(Notice, { tone: 'warn', style: { marginBottom: 6 } }, run.warnings.join(' · ')) : null,
              response?.truncated ? h(Notice, { tone: 'warn', style: { marginBottom: 6 } }, t('status.truncated')) : null,
              h(
                'div',
                { className: 'aps-response-tools' },
                h(DshSegmentedTabs, {
                  className: 'aps-response-viewtabs',
                  label: t('run.body'),
                  items: [{ value: 'pretty', label: t('run.pretty') }, { value: 'raw', label: t('run.raw') }],
                  value: bodyMode,
                  onChange: setBodyMode,
                }),
                h(TextInput, { value: jsonPath, onChange: setJsonPath, placeholder: t('run.jsonPath'), mono: true, style: { flex: 1, minWidth: 100 } }),
                h(IconButton, { name: 'doc', title: t('run.codeSnippet'), onClick: () => setCodeOpen(true), disabled: !run.request }),
                h(IconButton, { name: 'braces', title: curlCopied ? t('run.curlCopied') : t('run.copyCurl'), onClick: copyAsCurl, disabled: !run.request }),
                h(IconButton, { name: 'download', title: t('run.downloadBody'), onClick: downloadBody, disabled: !rawBody }),
                h(IconButton, {
                  name: 'copy',
                  title: bodyCopied ? t('run.copied') : t('run.copyBody'),
                  onClick: async () => {
                    try {
                      await navigator.clipboard.writeText(bodyText)
                      setBodyCopied(true)
                      window.setTimeout(() => setBodyCopied(false), 1500)
                    } catch {}
                  },
                }),
              ),
              jsonPath.trim().length > 0
                ? pathValue === undefined
                  ? h('div', { className: 'aps-muted', style: { fontSize: 12, marginBottom: 6 } }, t('run.pathEmpty'))
                  : h('pre', { className: 'aps-code aps-path-result' }, pretty(pathValue))
                : null,
              bodyText ? h('pre', { className: 'aps-code' }, truncate(bodyText, 200000)) : h('span', { className: 'aps-muted' }, '(empty body)'),
            )
          : null,
        activeTab === 'headers'
          ? h(
              'div',
              { className: 'aps-code-wrap' },
              response && Object.keys(response.headers || {}).length > 0
                ? h('table', { className: 'aps-table' }, h('thead', null, h('tr', null, h('th', null, 'Name'), h('th', null, 'Value'))), h('tbody', null, Object.entries(response.headers).map(([key, value]) => h('tr', { key }, h('td', { className: 'aps-mono' }, key), h('td', { className: 'aps-mono' }, String(value))))))
                : h('span', { className: 'aps-muted' }, '(no headers)'),
            )
          : null,
        activeTab === 'tests'
          ? h(
              'div',
              { className: 'aps-code-wrap' },
              tests.length === 0
                ? h('span', { className: 'aps-muted' }, t('status.noTests'))
                : tests.map((test, index) =>
                    h(
                      'div',
                      { key: index, className: `aps-assert-result ${test.passed ? 'pass' : 'fail'}` },
                      h(Icon, { name: test.passed ? 'check' : 'x', size: 12 }),
                      h('span', { className: 'aps-assert-name' }, testName(test)),
                      h('span', { className: 'aps-assert-msg' }, test.message || (test.passed ? 'passed' : 'failed')),
                    ),
                  ),
            )
          : null,
        activeTab === 'cookies'
          ? h(
              'div',
              { className: 'aps-code-wrap' },
              h('div', { className: 'aps-table' }, cookies.map((cookie, index) => h('div', { className: 'aps-assert-result', key: index }, h('span', { className: 'aps-assert-name' }, cookie.name), h('span', { className: 'aps-assert-msg' }, cookie.value)))),
              h('div', { className: 'aps-field-row', style: { marginTop: 8 } },
                h(Button, { size: 'small', tone: 'ghost', icon: 'plus', onClick: () => onApplyCookies?.(cookies), disabled: !onApplyCookies }, t('run.applyCookies')),
              ),
            )
          : null,
        activeTab === 'schema'
          ? h('div', { className: 'aps-code-wrap' }, hasSchema ? h(DshJsonTree, { data: response.json, label: t('run.schema'), copyable: true, expandTopLevel: true, className: 'aps-json-tree-dsh' }) : h('span', { className: 'aps-muted' }, t('run.schemaEmpty')))
          : null,
        codeOpen ? h(CodeSnippetModal, { request: run.request, variables: run.variables || {}, t, onClose: () => setCodeOpen(false) }) : null,
      )
    }

    /* ------------------------------------------------------------------ */
    /* Flow editor                                                         */
    /* ------------------------------------------------------------------ */

    function FlowResultPane({ run, t }) {
      return h(
        'div',
        { className: 'aps-flow-result' },
        run ? h(RunResult, { run, t }) : h(Empty, { title: t('run.empty'), hint: t('run.emptyHint') }),
      )
    }

    function FlowEditor({ draft, setDraft, dirty, requests, onSave, onRun, onRunDataset, onDelete, onDuplicate, running, datasetRunning, t }) {
      const patch = (value) => setDraft({ ...draft, ...value })
      const steps = Array.isArray(draft.steps) ? draft.steps : []
      const dataset = Array.isArray(draft.dataset) ? draft.dataset : []
      const updateStep = (index, stepPatch) => patch({ steps: steps.map((step, position) => (position === index ? { ...step, ...stepPatch } : step)) })
      const removeStep = (index) => patch({ steps: steps.filter((_step, position) => position !== index) })
      const moveStep = (index, delta) => {
        const next = [...steps]
        const target = index + delta
        if (target < 0 || target >= next.length) return
        const [item] = next.splice(index, 1)
        next.splice(target, 0, item)
        patch({ steps: next })
      }
      const addStep = () => patch({ steps: [...steps, newStepDraft(steps.length)] })
      const addExtract = (index) => {
        const step = steps[index]
        updateStep(index, { extract: [...(step.extract || []), { name: '', from: 'body', path: '' }] })
      }
      const updateExtract = (stepIndex, extractIndex, value) => {
        const step = steps[stepIndex]
        updateStep(stepIndex, { extract: (step.extract || []).map((entry, position) => (position === extractIndex ? { ...entry, ...value } : entry)) })
      }
      const removeExtract = (stepIndex, extractIndex) => {
        const step = steps[stepIndex]
        updateStep(stepIndex, { extract: (step.extract || []).filter((_entry, position) => position !== extractIndex) })
      }
      return h(
        'div',
        { className: 'aps-flow-wrap' },
        h(
          'div',
          { className: 'aps-card aps-flow-head' },
          h(
            'div',
            { className: 'aps-name-row' },
            h(TextInput, { className: 'aps-name-field', style: { flex: 1 }, value: draft.name ?? '', placeholder: t('flow.name'), onChange: (value) => patch({ name: value }) }),
            dirty ? h('span', { className: 'aps-dirty' }, t('request.unsaved')) : null,
            draft.id ? h(IconButton, { name: 'trash', onClick: onDelete, title: t('common.delete') }) : null,
            h(Button, { size: 'small', icon: 'save', onClick: onSave }, t('flow.save')),
            h(Button, { tone: 'primary', icon: 'play', onClick: onRun, disabled: running || !steps.length }, running ? t('common.running') : t('flow.run')),
            dataset.length > 0 ? h(Button, { size: 'small', tone: 'ghost', icon: 'play', onClick: onRunDataset, disabled: running || datasetRunning || !steps.length }, datasetRunning ? t('common.running') : t('flow.runDataset')) : null,
          ),
          h(TextInput, { value: draft.description ?? '', onChange: (value) => patch({ description: value }), placeholder: t('flow.description') }),
          h('div', { className: 'aps-field-row' }, h('span', { className: 'aps-muted', style: { fontSize: 10.5 } }, `${t('flow.folder')}:`), h(TextInput, { style: { width: 120 }, value: draft.folder ?? '', placeholder: t('collection.root'), onChange: (value) => patch({ folder: value }) })),
          h(
            'div',
            { className: 'aps-flow-meta' },
            h('span', { className: 'aps-muted', style: { fontSize: 10.5 } }, `${t('flow.stepCount', { count: steps.length })}`),
            h(Checkbox, { checked: draft.stopOnFailure !== false, onChange: (value) => patch({ stopOnFailure: value }), label: t('flow.stopOnFailure') }),
            h('span', { className: 'aps-tab-spacer' }),
            h('span', { className: 'aps-muted', style: { fontSize: 10.5 } }, `{{variable}}`),
          ),
          h('details', { className: 'aps-details' }, h('summary', null, t('flow.variables')), h(JsonObjectField, { value: draft.variables ?? {}, onApply: (value) => patch({ variables: value }), applyLabel: t('common.apply') })),
          h('details', { className: 'aps-details' }, h('summary', null, `${t('flow.dataset')} (${dataset.length})`), h(JsonObjectField, { value: dataset, onApply: (value) => patch({ dataset: value }), onChange: (value) => patch({ dataset: value }), array: true, applyLabel: t('common.apply'), rows: 6 }), h('div', { className: 'aps-muted', style: { fontSize: 11 } }, t('flow.datasetHint'))),
        ),
        requests.length === 0 ? h(Notice, { tone: 'warn' }, t('flow.noRequests')) : null,
        h(
          'div',
          { className: 'aps-card', style: { padding: 10 } },
          h(
            'div',
            { className: 'aps-section-title' },
            t('flow.steps'),
            h('span', { className: 'aps-muted', style: { textTransform: 'none', fontWeight: 400 } }, String(steps.length)),
            h('span', { className: 'aps-tab-spacer' }),
            h(Button, { size: 'small', tone: 'ghost', icon: 'plus', onClick: addStep }, t('flow.addStep')),
          ),
          h(
            'div',
            { className: 'aps-steps', style: { padding: 0 } },
            steps.map((step, index) =>
              h(
                'div',
                { className: 'aps-step', key: step.id || index },
                h(
                  'div',
                  { className: 'aps-step-head' },
                  h('span', { className: 'aps-step-num' }, String(index + 1)),
                  h(TextInput, { className: 'aps-step-name', style: { flex: 1 }, value: step.name ?? '', placeholder: t('flow.stepName'), onChange: (value) => updateStep(index, { name: value }) }),
                  h(IconButton, { name: 'up', onClick: () => moveStep(index, -1), title: 'Up', disabled: index === 0, size: 12 }),
                  h(IconButton, { name: 'down', onClick: () => moveStep(index, 1), title: 'Down', disabled: index === steps.length - 1, size: 12 }),
                  h(IconButton, { name: 'trash', onClick: () => removeStep(index), title: t('common.remove'), size: 12 }),
                ),
                h(
                  'div',
                  { className: 'aps-step-grid' },
                  h(Field, { label: t('flow.selectRequest') }, h(Select, {
                    value: step.requestId ?? '',
                    onChange: (value) => updateStep(index, { requestId: value }),
                    options: [{ value: '', label: t('flow.selectRequest') }, ...requests.map((request) => ({ value: request.id, label: `${request.method} · ${request.name}` }))],
                  })),
                  h(Field, { label: t('flow.continueOnFailure') }, h(Checkbox, { checked: step.continueOnFailure === true, onChange: (value) => updateStep(index, { continueOnFailure: value }), label: '' })),
                  h(Field, { label: t('flow.condition') }, h(TextInput, { className: 'aps-tiny', mono: true, value: step.condition ?? '', placeholder: 'variables.userId != null', onChange: (value) => updateStep(index, { condition: value }) })),
                  h(Field, { label: t('flow.delayMs') }, h(TextInput, { className: 'aps-tiny', type: 'number', min: 0, max: 60000, step: 100, value: step.delayMs ?? 0, onChange: (value) => updateStep(index, { delayMs: Number(value) || 0 }) })),
                ),
                h(
                  'div',
                  { style: { marginTop: 7 } },
                  h('div', { className: 'aps-field-label', style: { marginBottom: 3 } }, t('flow.extract')),
                  (step.extract || []).map((entry, extractIndex) =>
                    h(
                      'div',
                      { className: 'aps-extract-row', key: extractIndex },
                      h(TextInput, { className: 'aps-tiny', mono: true, value: entry.name ?? '', placeholder: 'variableName', onChange: (value) => updateExtract(index, extractIndex, { name: value }) }),
                      h(Select, { value: entry.from ?? 'body', onChange: (value) => updateExtract(index, extractIndex, { from: value }), options: [{ value: 'body', label: 'body' }, { value: 'header', label: 'header' }, { value: 'status', label: 'status' }, { value: 'regex', label: 'regex' }] }),
                      h(TextInput, { className: 'aps-tiny', mono: true, value: entry.path ?? '', placeholder: 'data.id', onChange: (value) => updateExtract(index, extractIndex, { path: value }) }),
                      h(IconButton, { name: 'x', onClick: () => removeExtract(index, extractIndex), title: t('common.remove'), size: 11 }),
                    ),
                  ),
                  h(Button, { size: 'small', tone: 'ghost', icon: 'plus', onClick: () => addExtract(index), style: { marginTop: 4 } }, t('flow.addExtract')),
                ),
                h('details', { className: 'aps-details' }, h('summary', null, t('flow.overrides')), h(JsonObjectField, { value: step.overrides ?? {}, onApply: (value) => updateStep(index, { overrides: value }), applyLabel: t('common.apply'), rows: 4 })),
              ),
            ),
          ),
          h(Button, { size: 'small', tone: 'ghost', icon: 'plus', onClick: addStep, style: { marginTop: 8 } }, t('flow.addStep')),
        ),
      )
    }

    /* ------------------------------------------------------------------ */
    /* Run result and detail                                               */
    /* ------------------------------------------------------------------ */

    function RunStat({ value, label }) {
      return h('div', { className: 'aps-stat' }, h('div', { className: 'aps-stat-value' }, value), h('div', { className: 'aps-stat-label' }, label))
    }

    function RunStats({ summary, t }) {
      const total = summary.tests?.total ?? 0
      const passed = summary.tests?.passed ?? 0
      const failed = summary.tests?.failed ?? 0
      const percent = total === 0 ? 0 : Math.round((passed / total) * 100)
      return h(
        'div',
        { className: 'aps-run-stats' },
        h(
          'div',
          { className: 'aps-test-meter', title: `${t('run.testMeter')} ${passed}/${total}` },
          h('div', { className: 'aps-test-ring', style: { background: `conic-gradient(var(--dsw-alias-state-success-primary) ${percent}%, color-mix(in srgb,var(--dsw-alias-state-error-primary) 55%,transparent) ${percent}% 100%)` } },
            h('span', { className: 'aps-test-ring-value' }, `${percent}%`),
          ),
          h('div', { className: 'aps-test-meter-label' }, h('span', null, t('run.testMeter')), h('span', { className: 'aps-muted' }, `${passed}/${total}${failed > 0 ? ` · ${failed} failed` : ''}`)),
        ),
        h(
          'div',
          { className: 'aps-stat-grid' },
          h(RunStat, { value: `${summary.executed ?? 0}`, label: t('run.executed') }),
          h(RunStat, { value: `${summary.passed ?? 0}`, label: t('run.passedSteps') }),
          h(RunStat, { value: `${summary.failed ?? 0}`, label: t('run.failedSteps') }),
          h(RunStat, { value: compareSummary(summary), label: t('run.assertions') }),
          h(RunStat, { value: fmtDuration(summary.avgLatencyMs), label: t('run.avgLatency') }),
          h(RunStat, { value: fmtDuration(summary.maxLatencyMs), label: t('run.maxLatency') }),
        ),
      )
    }

    function StepResult({ step, index, t }) {
      const response = step.response
      const bodyText = response?.json !== undefined ? pretty(response.json) : response?.body ?? ''
      return h(
        'details',
        { className: 'aps-step-result' },
        h(
          'summary',
          null,
          h('span', { className: 'aps-step-num' }, String(index + 1)),
          h(Pill, { tone: step.skipped ? 'neutral' : step.passed ? 'ok' : 'bad' }, step.skipped ? t('run.skipped') : step.passed ? t('run.passed') : t('run.failed')),
          h('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 550 } }, step.stepName || step.requestName || ''),
          h('span', { className: 'aps-muted aps-mono', style: { fontSize: 10.5 } }, `${response?.status ?? '—'} · ${fmtDuration(step.durationMs ?? response?.durationMs)}`),
        ),
        h(
          'div',
          { className: 'aps-step-result-body' },
          step.request ? h('div', { className: 'aps-subhead' }, t('run.request')) : null,
          step.request ? h('pre', { className: 'aps-code' }, `${step.request.method} ${step.request.url}`) : null,
          step.skipped ? h(Notice, { tone: 'warn' }, t('run.skippedHint')) : null,
          step.error ? h(Notice, { tone: 'bad' }, step.error) : null,
          step.extractErrors?.length ? h(Notice, { tone: 'bad' }, step.extractErrors.join(' · ')) : null,
          Object.keys(step.extracted || {}).length > 0 ? h('div', { className: 'aps-subhead' }, t('flow.extracted')) : null,
          Object.keys(step.extracted || {}).length > 0 ? h('pre', { className: 'aps-code' }, Object.entries(step.extracted).map(([key, value]) => `${key} = ${value}`).join('\n')) : null,
          h('div', { className: 'aps-subhead' }, t('run.tests')),
          (step.tests || []).length === 0
            ? h('div', { className: 'aps-muted', style: { fontSize: 11.5 } }, t('status.noTests'))
            : (step.tests || []).map((test, testIndex) =>
                h('div', { key: testIndex, className: `aps-assert-result ${test.passed ? 'pass' : 'fail'}` }, h(Icon, { name: test.passed ? 'check' : 'x', size: 12 }), h('span', { className: 'aps-assert-name' }, testName(test)), h('span', { className: 'aps-assert-msg' }, test.message || '')),
              ),
          bodyText ? h('div', { className: 'aps-subhead' }, t('run.body')) : null,
          bodyText ? h('pre', { className: 'aps-code', style: { maxHeight: 260, overflow: 'auto' } }, truncate(bodyText, 12000)) : null,
        ),
      )
    }

    function RunResult({ run, t }) {
      const summary = runSummary(run)
      if (Array.isArray(run.steps)) {
        return h(
          'div',
          { className: 'aps-card', style: { padding: 10 } },
          h(
            'div',
            { className: 'aps-run-head', style: { padding: '0 0 9px', borderBottom: '1px solid var(--dsw-alias-border-l1)', marginBottom: 9 } },
            h(Pill, { tone: statusTone(run) }, run.passed ? t('run.passed') : t('run.failed')),
            h('span', { className: 'aps-run-title' }, run.title || run.flowName || t('run.kindFlow')),
          ),
          h(RunStats, { summary, t }),
          h('div', { className: 'aps-subhead', style: { marginTop: 10 } }, t('run.steps')),
          run.steps.map((step, index) => h(StepResult, { key: step.stepId || index, step, index, t })),
          Object.keys(run.variables || {}).length > 0 ? h('details', { className: 'aps-details' }, h('summary', null, t('run.variables')), h('pre', { className: 'aps-code', style: { maxHeight: 220, overflow: 'auto' } }, pretty(run.variables))) : null,
        )
      }
      return h(
        'div',
        { className: 'aps-workbench' },
        h(
          'div',
          { className: 'aps-card', style: { padding: 10 } },
          h(
            'div',
            { className: 'aps-run-head', style: { padding: '0 0 9px', borderBottom: '1px solid var(--dsw-alias-border-l1)', marginBottom: 9 } },
            h(Pill, { tone: statusTone(run) }, run.passed ? t('run.passed') : t('run.failed')),
            h('span', { className: 'aps-run-title' }, run.title || run.requestName || t('run.kindRequest')),
          ),
          h(RunStats, { summary, t }),
        ),
        h(ResponsePanel, { run, t }),
      )
    }

    function RunTrend({ runs, currentId, t }) {
      const [limit, setLimit] = React.useState(12)
      const [days, setDays] = React.useState(0)
      const all = Array.isArray(runs) ? runs : []
      const cutoff = days === 0 ? 0 : Date.now() - days * 86400000
      const history = cutoff === 0 ? all : all.filter((run) => new Date(run.createdAt).getTime() >= cutoff)
      const data = (limit === 0 ? history : history.slice(0, limit)).slice().reverse()
      if (all.length === 0) return null
      const passed = data.filter((run) => run.passed).length
      const avg = data.length === 0 ? 0 : Math.round(data.reduce((sum, run) => sum + (Number(run.durationMs) || 0), 0) / data.length)
      const max = Math.max(1, ...data.map((run) => Number(run.durationMs) || 0))
      return h(
        'div',
        { className: 'aps-card aps-trend-card' },
        h(
          'div',
          { className: 'aps-trend-head' },
          h('div', { className: 'aps-section-title' }, t('run.trend')),
          h('span', { className: 'aps-muted', style: { fontSize: 11 } }, `${passed}/${data.length} · ${t('run.avg')} ${fmtDuration(avg)}`),
          h('span', { className: 'aps-tab-spacer' }),
          h(DshSegmentedTabs, {
            className: 'aps-trend-tabs',
            label: t('run.trend'),
            items: [{ value: 12, label: t('run.last12') }, { value: 24, label: t('run.last24') }, { value: 0, label: t('run.allRuns') }],
            value: limit,
            onChange: setLimit,
          }),
          h(Select, {
            value: days,
            onChange: (value) => setDays(Number(value)),
            options: [{ value: 0, label: t('run.rangeAll') }, { value: 7, label: t('run.range7') }, { value: 30, label: t('run.range30') }],
            className: 'aps-trend-range',
          }),
        ),
        data.length === 0
          ? h('div', { className: 'aps-muted', style: { fontSize: 11 } }, t('run.noRuns'))
          : h(
          'div',
          { className: 'aps-trend' },
          data.map((entry) => h(
            'div',
            { className: `aps-trend-item ${entry.id === currentId ? 'current' : ''}`, key: entry.id, title: `${entry.title || entry.id} · ${entry.passed ? 'passed' : 'failed'} · ${fmtDuration(entry.durationMs)}` },
            h('div', { className: 'aps-trend-track' }, h('div', { className: `aps-trend-bar ${entry.passed ? 'pass' : 'fail'}`, style: { height: `${Math.max(8, Math.round(((Number(entry.durationMs) || 0) / max) * 100))}%` } })),
            h('span', { className: 'aps-trend-label' }, fmtDuration(entry.durationMs)),
          )),
        ),
      )
    }

    function MatrixModal({ requests, environments, onClose, onRun, result, running, onOpenRun, t }) {
      const [selected, setSelected] = React.useState(() => new Set((environments || []).map((entry) => entry.id)))
      const [requestId, setRequestId] = React.useState('')
      const [includeFlows, setIncludeFlows] = React.useState(true)
      const [view, setView] = React.useState('grouped')
      const [matrixCopied, setMatrixCopied] = React.useState(false)
      const [onlyDiff, setOnlyDiff] = React.useState(false)
      const toggle = (id) => setSelected((current) => {
        const next = new Set(current)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
      const run = () => onRun({
        environmentIds: [...selected],
        requestIds: requestId ? [requestId] : undefined,
        includeFlows,
      })
      const envName = (id) => (environments || []).find((entry) => entry.id === id)?.name || id || '—'
      const matrixTitles = result ? [...new Set((result.matrix || []).flatMap((group) => (group.runs || []).map((entry) => entry.title || entry.id)))] : []
      const rowEntries = (title) => (result?.matrix || []).map((group) => (group.runs || []).find((run) => (run.title || run.id) === title))
      const hasDiff = (title) => {
        const entries = rowEntries(title).filter(Boolean)
        return new Set(entries.map((entry) => entry.passed === true)).size > 1
      }
      const visibleTitles = onlyDiff ? matrixTitles.filter(hasDiff) : matrixTitles
      const diffCount = matrixTitles.filter(hasDiff).length
      const copyMatrix = async () => {
        if (!result?.matrix) return
        const titles = [...new Set((result.matrix || []).flatMap((group) => (group.runs || []).map((entry) => entry.title || entry.id)))]
        const lines = [['Request', ...(result.matrix || []).map((group) => envName(group.environmentId))].join('\t')]
        for (const title of titles) {
          lines.push([title, ...(result.matrix || []).map((group) => {
            const entry = (group.runs || []).find((run) => (run.title || run.id) === title)
            return entry ? `${entry.passed ? 'PASS' : 'FAIL'} ${entry.summary?.avgLatencyMs ?? entry.durationMs ?? ''}` : '—'
          })].join('\t'))
        }
        try {
          await navigator.clipboard.writeText(lines.join('\n'))
          setMatrixCopied(true)
          window.setTimeout(() => setMatrixCopied(false), 1500)
        } catch {}
      }
      const downloadDiffReport = () => {
        if (!result?.matrix) return
        const titles = matrixTitles.filter(hasDiff)
        const lines = [['Request', ...(result.matrix || []).map((group) => envName(group.environmentId))].join('\t')]
        for (const title of titles) {
          lines.push([title, ...(result.matrix || []).map((group) => {
            const entry = rowEntries(title).find((run) => run && (run.title || run.id) === title)
            return entry ? `${entry.passed ? 'PASS' : 'FAIL'} ${entry.summary?.avgLatencyMs ?? entry.durationMs ?? ''}` : '—'
          })].join('\t'))
        }
        const blob = new Blob([lines.join('\n')], { type: 'text/tab-separated-values;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'airpost-matrix-diff.tsv'
        document.body.append(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
      }
      const downloadMatrixMarkdown = () => {
        if (!result?.matrix) return
        const esc = (value) => String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')
        const lines = ['# AirPost Environment Matrix', '', `- Environments: ${(result.matrix || []).length}`, `- Runs: ${result.count ?? 0}`, `- Passed: ${result.passed ?? 0}`, `- Failed: ${result.failed ?? 0}`, '', ...(result.matrix || []).map((group) => { const percent = group.count > 0 ? Math.round((group.passed / group.count) * 100) : 0; const filled = Math.round(percent / 10); return `- ${envName(group.environmentId)}: ${'█'.repeat(filled)}${'░'.repeat(10 - filled)} ${group.passed}/${group.count}` }), '', `| Request | ${(result.matrix || []).map((group) => esc(envName(group.environmentId))).join(' | ')} |`, `| --- | ${(result.matrix || []).map(() => '---').join(' | ')} |`]
        for (const title of matrixTitles) {
          const cells = (result.matrix || []).map((group) => {
            const entry = rowEntries(title).find((run) => run && (run.title || run.id) === title)
            return entry ? `${entry.passed ? 'PASS' : 'FAIL'} ${entry.summary?.avgLatencyMs ?? entry.durationMs ?? ''}` : '—'
          })
          lines.push(`| ${esc(title)} | ${cells.map(esc).join(' | ')} |`)
        }
        const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'airpost-matrix.md'
        document.body.append(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
      }
      const downloadMatrixHtml = () => {
        if (!result?.matrix) return
        const esc = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        const headers = (result.matrix || []).map((group) => `<th>${esc(envName(group.environmentId))}</th>`).join('')
        const rows = matrixTitles.map((title) => {
          const cells = (result.matrix || []).map((group) => {
            const entry = rowEntries(title).find((run) => run && (run.title || run.id) === title)
            if (!entry) return '<td>—</td>'
            return `<td class="${entry.passed ? 'pass' : 'fail'}">${entry.passed ? 'PASS' : 'FAIL'} · ${esc(entry.summary?.avgLatencyMs ?? entry.durationMs ?? '')}</td>`
          }).join('')
          return `<tr><td>${esc(title)}</td>${cells}</tr>`
        }).join('')
        const svgRows = (result.matrix || []).map((group, index) => {
          const y = 34 + index * 32
          const percent = group.count > 0 ? Math.round((group.passed / group.count) * 100) : 0
          return `<text x="8" y="${y + 11}" font-size="12" fill="#1f2328">${esc(envName(group.environmentId))}</text><rect x="150" y="${y + 2}" width="360" height="10" rx="5" fill="#eaeef2"/><rect x="150" y="${y + 2}" width="${Math.round(3.6 * percent)}" height="10" rx="5" fill="${group.failed > 0 ? '#cf222e' : '#1a7f37'}"/><text x="520" y="${y + 11}" font-size="11" fill="#57606a">${group.passed}/${group.count} · ${percent}%</text>`
        }).join('')
        const chart = `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="${40 + (result.matrix || []).length * 32}" viewBox="0 0 620 ${40 + (result.matrix || []).length * 32}"><rect width="100%" height="100%" fill="#ffffff"/>${svgRows}</svg>`
        const html = `<!doctype html><html><head><meta charset="utf-8"><title>AirPost Matrix</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;max-width:1100px;margin:36px auto;padding:0 20px;color:#1f2328}table{border-collapse:collapse;width:100%}th,td{border:1px solid #d0d7de;padding:6px 8px;text-align:left;font-size:12px}th{background:#f6f8fa}.pass{color:#1a7f37}.fail{color:#cf222e}h1{font-size:20px}.meta{color:#57606a;font-size:12px}.bar{display:flex;align-items:center;gap:8px;margin:4px 0;font-size:12px}.bar span{width:150px}.bar em{font-style:normal;color:#57606a}.track{flex:1;height:7px;background:#eaeef2;border-radius:4px;overflow:hidden}.track i{display:block;height:100%;background:#1a7f37}.track i.fail{background:#cf222e}.theme{position:fixed;right:16px;top:16px;border:1px solid #d0d7de;background:#fff;border-radius:6px;padding:4px 8px;cursor:pointer}body.dark{background:#0d1117;color:#e6edf3}body.dark .meta{color:#8b949e}body.dark th{background:#161b22}body.dark th,body.dark td{border-color:#30363d}body.dark .track{background:#21262d}body.dark .theme{background:#161b22;color:#e6edf3;border-color:#30363d}.lang{right:64px}@media (prefers-color-scheme: dark){body{background:#0d1117;color:#e6edf3}.meta{color:#8b949e}th{background:#161b22}th,td{border-color:#30363d}.track{background:#21262d}}</style></head><body><button id="theme" class="theme">◐</button><h1>AirPost Environment Matrix</h1><p class="meta">Environments: ${(result.matrix || []).length} · Runs: ${result.count ?? 0} · Passed: ${result.passed ?? 0} · Failed: ${result.failed ?? 0}</p>${chart}<table><thead><tr><th>Request</th>${headers}</tr></thead><tbody>${rows}</tbody></table><script>document.getElementById('theme').addEventListener('click',function(){document.body.classList.toggle('dark')});</script></body></html>`
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'airpost-matrix.html'
        document.body.append(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
      }
      const downloadMatrixSvg = () => {
        if (!result?.matrix) return
        const esc = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        const rows = result.matrix || []
        const height = 50 + rows.length * 34
        const parts = [`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="${height}" viewBox="0 0 640 ${height}">`, '<style>text{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;fill:#1f2328}.name{font-size:12px}.pct{font-size:11px;fill:#57606a}.title{font-size:16px;font-weight:600}</style>', '<rect width="640" height="100%" fill="#ffffff"/>', '<text x="20" y="28" class="title">AirPost Environment Matrix</text>']
        rows.forEach((group, index) => {
          const y = 50 + index * 34
          const percent = group.count > 0 ? Math.round((group.passed / group.count) * 100) : 0
          parts.push(`<text x="20" y="${y + 13}" class="name">${esc(envName(group.environmentId))}</text>`)
          parts.push(`<rect x="150" y="${y + 4}" width="380" height="10" rx="5" fill="#eaeef2"/>`)
          parts.push(`<rect x="150" y="${y + 4}" width="${Math.round(3.8 * percent)}" height="10" rx="5" fill="${group.failed > 0 ? '#cf222e' : '#1a7f37'}"/>`)
          parts.push(`<text x="542" y="${y + 13}" class="pct">${group.passed}/${group.count} · ${percent}%</text>`)
        })
        parts.push('</svg>')
        const blob = new Blob([parts.join('')], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'airpost-matrix.svg'
        document.body.append(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
      }
      const downloadMatrixPng = () => {
        if (!result?.matrix) return
        const rows = result.matrix || []
        const width = 700
        const height = 70 + rows.length * 38
        const scale = 2
        const canvas = document.createElement('canvas')
        canvas.width = width * scale
        canvas.height = height * scale
        const context = canvas.getContext('2d')
        if (!context) return
        context.scale(scale, scale)
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, width, height)
        context.fillStyle = '#1f2328'
        context.font = '600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        context.fillText('AirPost Environment Matrix', 20, 30)
        context.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        rows.forEach((group, index) => {
          const y = 56 + index * 38
          const percent = group.count > 0 ? Math.round((group.passed / group.count) * 100) : 0
          context.fillStyle = '#1f2328'
          context.fillText(String(envName(group.environmentId)).slice(0, 28), 20, y + 11)
          context.fillStyle = '#eaeef2'
          context.fillRect(200, y + 1, 400, 12)
          context.fillStyle = group.failed > 0 ? '#cf222e' : '#1a7f37'
          context.fillRect(200, y + 1, (400 * percent) / 100, 12)
          context.fillStyle = '#57606a'
          context.fillText(`${group.passed}/${group.count} · ${percent}%`, 615, y + 11)
        })
        canvas.toBlob((blob) => {
          if (!blob) return
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = 'airpost-matrix.png'
          document.body.append(link)
          link.click()
          link.remove()
          URL.revokeObjectURL(url)
        }, 'image/png')
      }
      const downloadMatrix = () => {
        if (!result?.matrix) return
        const titles = [...new Set((result.matrix || []).flatMap((group) => (group.runs || []).map((entry) => entry.title || entry.id)))]
        const lines = [['Request', ...(result.matrix || []).map((group) => envName(group.environmentId))].join('\t')]
        for (const title of titles) {
          lines.push([title, ...(result.matrix || []).map((group) => {
            const entry = (group.runs || []).find((run) => (run.title || run.id) === title)
            return entry ? `${entry.passed ? 'PASS' : 'FAIL'} ${entry.summary?.avgLatencyMs ?? entry.durationMs ?? ''}` : '—'
          })].join('\t'))
        }
        const blob = new Blob([lines.join('\n')], { type: 'text/tab-separated-values;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'airpost-matrix.tsv'
        document.body.append(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
      }
      return h(
        DshModal,
        { open: true, onClose, title: t('run.matrixTitle'), closeLabel: t('common.close') },
        h(
          'div',
          { className: 'aps-matrix' },
          h('div', { className: 'aps-muted', style: { fontSize: 12 } }, t('run.matrixHint')),
          h('div', { className: 'aps-section-title' }, t('run.matrixEnvironments')),
          h('div', { className: 'aps-matrix-envs' }, (environments || []).map((environment) => h(Checkbox, { key: environment.id, checked: selected.has(environment.id), onChange: () => toggle(environment.id), label: environment.name }))),
          h(Field, { label: t('run.matrixRequest') }, h(Select, {
            value: requestId,
            onChange: setRequestId,
            options: [{ value: '', label: t('run.matrixAllRequests') }, ...(requests || []).map((request) => ({ value: request.id, label: `${request.method} · ${request.name}` }))],
          })),
          h('div', { className: 'aps-field-row' }, h(Checkbox, { checked: includeFlows, onChange: setIncludeFlows, label: t('run.matrixIncludeFlows') }), h('span', { className: 'aps-tab-spacer' }), h(Button, { tone: 'primary', size: 'small', icon: 'play', onClick: run, disabled: running || selected.size === 0 }, running ? t('common.running') : t('run.matrixRun'))),
          h('div', { className: 'aps-section-title' }, t('run.matrixTitle'), h('span', { className: 'aps-tab-spacer' }), h(DshSegmentedTabs, { className: 'aps-matrix-tabs', label: t('run.matrixTitle'), items: [{ value: 'grouped', label: t('run.matrixGrouped') }, { value: 'table', label: t('run.matrixTable') }], value: view, onChange: setView }), result ? h(Checkbox, { checked: onlyDiff, onChange: setOnlyDiff, label: `${t('run.matrixOnlyDiff')} (${diffCount})` }) : null, result && diffCount > 0 ? h(IconButton, { name: 'download', title: t('run.matrixDiffReport'), onClick: downloadDiffReport }) : null, result ? h(IconButton, { name: 'doc', title: t('run.matrixMarkdown'), onClick: downloadMatrixMarkdown }) : null, result ? h(IconButton, { name: 'braces', title: t('run.matrixHtml'), onClick: downloadMatrixHtml }) : null, result ? h(IconButton, { name: 'download', title: t('run.matrixSvg'), onClick: downloadMatrixSvg }) : null, result ? h(IconButton, { name: 'download', title: t('run.matrixPng'), onClick: downloadMatrixPng }) : null, result ? h(IconButton, { name: 'copy', title: matrixCopied ? t('run.matrixCopied') : t('run.matrixCopy'), onClick: copyMatrix }) : null, result ? h(IconButton, { name: 'download', title: t('run.matrixDownload'), onClick: downloadMatrix }) : null),
          result ? h('div', { className: 'aps-matrix-chart' }, (result.matrix || []).map((group) => h('div', { className: 'aps-matrix-chart-row', key: group.environmentId || 'active' }, h('span', { className: 'aps-matrix-chart-name' }, envName(group.environmentId)), h('span', { className: 'aps-matrix-chart-track' }, h('span', { className: group.failed > 0 ? 'aps-matrix-chart-fill fail' : 'aps-matrix-chart-fill', style: { width: `${group.count > 0 ? Math.round((group.passed / group.count) * 100) : 0}%` } })), h('span', { className: 'aps-muted', style: { fontSize: 10, minWidth: 42, textAlign: 'right' } }, `${group.passed}/${group.count}`)))) : null,
          !result ? h('div', { className: 'aps-muted' }, t('run.matrixEmpty')) : view === 'grouped'
            ? h('div', { className: 'aps-matrix-results' }, (result.matrix || []).map((group) => h('div', { className: 'aps-card aps-matrix-group', key: group.environmentId || 'active' }, h('div', { className: 'aps-field-row' }, h('span', { className: 'aps-matrix-env' }, envName(group.environmentId)), h(Pill, { tone: group.failed > 0 ? 'bad' : 'ok' }, `${group.passed}/${group.count}`)), (group.runs || []).map((entry) => h(Button, { key: entry.id || `${group.environmentId}-${entry.title}`, size: 'small', tone: 'ghost', onClick: () => entry.id && onOpenRun(entry.id), disabled: !entry.id }, `${entry.passed ? '✓' : '✕'} ${entry.title || entry.id}`)))))
            : h(
                'div',
                { className: 'aps-matrix-table-wrap' },
                h(
                  'table',
                  { className: 'aps-table aps-matrix-table' },
                  h('thead', null, h('tr', null, h('th', null, t('run.matrixRequestCol')), (result.matrix || []).map((group) => h('th', { key: group.environmentId || 'active' }, envName(group.environmentId))))),
                  h(
                    'tbody',
                    null,
                    visibleTitles.map((title) => h(
                      'tr',
                      { key: title, className: hasDiff(title) ? 'aps-matrix-diff-row' : '' },
                      h('td', { className: 'aps-mono' }, title, hasDiff(title) ? h('span', { className: 'aps-matrix-diff' }, ` ${t('run.matrixDiff')}`) : null),
                      (result.matrix || []).map((group) => {
                        const entry = (group.runs || []).find((run) => (run.title || run.id) === title)
                        return h('td', { key: group.environmentId || 'active' }, entry ? h(Button, { size: 'small', tone: 'ghost', onClick: () => entry.id && onOpenRun(entry.id), disabled: !entry.id, className: entry.passed ? 'aps-matrix-pass' : 'aps-matrix-fail' }, `${entry.passed ? '✓' : '✕'} ${fmtDuration(entry.summary?.avgLatencyMs ?? entry.durationMs)}`) : h('span', { className: 'aps-muted' }, '—'))
                      }),
                    )),
                  ),
                ),
              ),
        ),
      )
    }

    function RunDetail({ run, t, history = [] }) {
      if (!run) return h(Empty, { title: t('run.empty'), hint: t('run.emptyHint') })
      return h(
        'div',
        { className: 'aps-run-wrap' },
        h(
          'div',
          { className: 'aps-card' },
          h(
            'div',
            { className: 'aps-run-head' },
            h(Pill, { tone: statusTone(run) }, run.passed ? t('run.passed') : t('run.failed')),
            h('span', { className: 'aps-run-title' }, run.title || run.requestName || run.flowName),
            h(Pill, { tone: 'neutral' }, run.kind === 'flow' ? t('run.kindFlow') : t('run.kindRequest')),
            h('span', { className: 'aps-muted', style: { fontSize: 11 } }, fmtTime(run.createdAt)),
          ),
          h('div', { style: { padding: 12 } }, h(RunStats, { summary: runSummary(run), t })),
        ),
        h(RunTrend, { runs: history, currentId: run.id, t }),
        h(RunResult, { run, t }),
      )
    }

    /* ------------------------------------------------------------------ */
    /* Variables, reports, AI                                              */
    /* ------------------------------------------------------------------ */

    function VariablesModal({ variables, onSave, onClose, t }) {
      return h(
        DshModal,
        {
          open: true,
          onClose,
          title: t('vars.title'),
          closeLabel: t('common.close'),
        },
        h(
          'div',
          { className: 'aps-modal-body' },
          h('div', { className: 'aps-muted', style: { fontSize: 11.5, lineHeight: 1.6 } }, t('vars.hint')),
          h(JsonObjectField, { value: variables, onApply: onSave, applyLabel: t('vars.save'), rows: 12 }),
        ),
      )
    }

    function SelfTestModal({ result, onClose, t }) {
      return h(
        DshModal,
        { open: true, onClose, title: t('run.selfTest'), closeLabel: t('common.close') },
        h(
          'div',
          { className: 'aps-self-test' },
          h('div', { className: 'aps-field-row' }, h(Pill, { tone: result.failed > 0 ? 'bad' : 'ok' }, `${result.passed} / ${result.passed + result.failed}`), h('span', { className: 'aps-muted', style: { fontSize: 11 } }, t('run.selfTestSummary', { passed: result.passed, failed: result.failed }))),
          h('table', { className: 'aps-table' }, h('thead', null, h('tr', null, h('th', null, t('run.check')), h('th', null, 'Status'), h('th', null, 'Detail'))), h('tbody', null, (result.checks || []).map((check, index) => h('tr', { key: index }, h('td', { className: 'aps-mono' }, check.name), h('td', null, h(Pill, { tone: check.passed ? 'ok' : 'bad' }, check.passed ? 'PASS' : 'FAIL')), h('td', { className: 'aps-mono' }, String(check.detail ?? '').slice(0, 200)))))),
        ),
      )
    }

    function ReportView({ report, content, onDelete, t }) {
      if (!report) return h(Empty, { title: t('report.empty'), hint: t('report.emptyHint') })
      return h(
        'div',
        { className: 'aps-report aps-card' },
        h(
          'div',
          { className: 'aps-report-head' },
          h(Pill, { tone: report.ai ? 'ok' : 'neutral' }, report.ai ? t('report.aiBadge') : t('report.ruleBadge')),
          h('span', { className: 'aps-report-title' }, report.title || t('panel.title')),
          h('span', { className: 'aps-muted', style: { fontSize: 10.5 } }, fmtTime(report.createdAt)),
          h(IconButton, { name: 'trash', onClick: onDelete, title: t('common.delete') }),
        ),
        h('div', { className: 'aps-report-body' }, h('pre', { className: 'aps-report-text' }, content || '')),
      )
    }

    /* ------------------------------------------------------------------ */
    /* Navigation list                                                     */
    /* ------------------------------------------------------------------ */

    function readSplitWidth(key, fallback) {
      try {
        const value = Number(window.localStorage.getItem(key))
        return Number.isFinite(value) && value >= 80 ? value : fallback
      } catch {
        return fallback
      }
    }

    function ResizableSplit({ left, right, collapsed = false, storageKey, initial = 154, min = 110, max = 360, label, sessionId }) {
      const rootRef = React.useRef(null)
      const [width, setWidth] = React.useState(() => readSplitWidth(storageKey, initial))
      const widthRef = React.useRef(width)
      React.useEffect(() => {
        widthRef.current = width
      }, [width])
      React.useEffect(() => {
        if (!storageKey) return
        setWidth(readSplitWidth(storageKey, initial))
      }, [storageKey, initial])
      const limit = (value) => {
        const containerWidth = rootRef.current ? rootRef.current.getBoundingClientRect().width : 900
        const upper = Math.max(min, Math.min(max, containerWidth - 190))
        return Math.max(min, Math.min(upper, value))
      }
      const persist = (value) => {
        try {
          window.localStorage.setItem(storageKey, String(value))
        } catch {
          // Ignore storage failures; the gesture still works for this mount.
        }
      }
      const set = (value, save = false) => {
        const next = limit(value)
        widthRef.current = next
        setWidth(next)
        if (save) persist(next)
      }
      const startDrag = (event) => {
        if (event.button !== undefined && event.button !== 0) return
        event.preventDefault()
        const handle = event.currentTarget
        handle.setPointerCapture?.(event.pointerId)
        handle.setAttribute('data-dragging', '')
        const startX = event.clientX
        const startWidth = widthRef.current
        const move = (moveEvent) => {
          set(startWidth + moveEvent.clientX - startX)
        }
        const stop = () => {
          document.removeEventListener('pointermove', move)
          document.removeEventListener('pointerup', stop)
          document.removeEventListener('pointercancel', stop)
          document.body.style.cursor = ''
          document.body.style.userSelect = ''
          handle.removeAttribute('data-dragging')
          persist(widthRef.current)
        }
        document.body.style.cursor = 'col-resize'
        document.body.style.userSelect = 'none'
        document.addEventListener('pointermove', move)
        document.addEventListener('pointerup', stop)
        document.addEventListener('pointercancel', stop)
      }
      const onKeyDown = (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home' && event.key !== 'End') return
        event.preventDefault()
        if (event.key === 'Home') set(min, true)
        else if (event.key === 'End') set(max, true)
        else set(widthRef.current + (event.key === 'ArrowRight' ? 16 : -16), true)
      }
      if (collapsed || left === null || left === undefined) {
        return h('div', { className: 'aps-split', ref: rootRef }, h('div', { className: 'aps-split-right' }, right))
      }
      return h(
        'div',
        { className: 'aps-split', ref: rootRef },
        h('div', { className: 'aps-split-left', style: { flexBasis: `${width}px`, width: `${width}px` } }, left),
        h('div', {
          className: 'aps-split-handle',
          role: 'separator',
          'aria-orientation': 'vertical',
          'aria-label': label,
          'aria-valuemin': min,
          'aria-valuemax': max,
          'aria-valuenow': width,
          tabIndex: 0,
          title: label,
          onPointerDown: startDrag,
          onKeyDown,
          onDoubleClick: () => set(initial, true),
        }),
        h('div', { className: 'aps-split-right' }, right),
      )
    }

    function folderGroups(items, query) {
      const normalized = query.trim().toLowerCase()
      const map = new Map()
      for (const item of items) {
        const haystack = `${item.name} ${item.description || ''} ${item.url || ''} ${item.method || ''}`.toLowerCase()
        if (normalized.length > 0 && !haystack.includes(normalized)) continue
        const folder = String(item.folder || '').trim()
        if (!map.has(folder)) map.set(folder, [])
        map.get(folder).push(item)
      }
      return [...map.entries()]
        .sort((left, right) => {
          if (left[0].length === 0) return -1
          if (right[0].length === 0) return 1
          return left[0].localeCompare(right[0], 'zh-Hans-CN')
        })
        .map(([folder, entries]) => ({ folder, items: entries }))
    }

    function CollectionPane({ kind, items, activeId, onSelect, onNew, t }) {
      const [query, setQuery] = React.useState('')
      const [collapsed, setCollapsed] = React.useState({})
      const groups = folderGroups(items, query)
      const emptyLabel = query.trim().length > 0 ? t('empty.search') : t(kind === 'flow' ? 'collection.flowEmpty' : 'collection.empty')
      return h(
        'div',
        { className: 'aps-collection' },
        h(
          'div',
          { className: 'aps-collection-head' },
          h('span', { className: 'aps-collection-title' }, t(kind === 'flow' ? 'collection.flows' : 'collection.requests')),
          h(
          DshTooltip,
          { label: t(kind === 'flow' ? 'flow.new' : 'request.new') },
          h(DshButton, {
            variant: 'toolbar',
            size: 'sm',
            className: 'aps-tab-add',
            icon: h(Icon, { name: 'plus', size: 14 }),
            onClick: onNew,
            'aria-label': t(kind === 'flow' ? 'flow.new' : 'request.new'),
          }),
        ),
        ),
        h('div', { className: 'aps-collection-search' }, h(TextInput, { value: query, onChange: setQuery, placeholder: t('nav.search') })),
        h(
          'div',
          { className: 'aps-tree' },
          groups.length === 0
            ? h('div', { className: 'aps-tree-empty' }, emptyLabel)
            : groups.map((group) => {
                const key = group.folder || '__root'
                const closed = collapsed[key] === true
                return h(
                  DshDisclosureRow,
                  {
                    key,
                    title: group.folder || t('collection.root'),
                    open: !closed,
                    expandable: true,
                    expandOnRowClick: true,
                    onToggle: () => setCollapsed((current) => ({ ...current, [key]: !closed })),
                    icon: h(Icon, { name: closed ? 'folder-closed' : 'folder', size: 13 }),
                    headerAccessory: h(DshTag, { tone: 'neutral' }, String(group.items.length)),
                    className: 'aps-folder-row',
                    contentClassName: 'aps-folder-content',
                  },
                  group.items.map((item) =>
                    h(
                      DshButton,
                      {
                        key: item.id,
                        variant: 'ghost',
                        size: 'sm',
                        className: `aps-tree-item ${activeId === item.id ? 'active' : ''}`,
                        onClick: () => onSelect(item.id),
                        title: `${item.method || 'FLOW'} ${item.name}`,
                      },
                      h('span', { className: `aps-method ${kind === 'flow' ? 'FLOW' : methodClass(item.method)}` }, kind === 'flow' ? 'FLOW' : (item.method || 'GET')),
                      h('span', { className: 'aps-tree-name' }, item.name),
                    ),
                  ),
                )
              }),
        ),
      )
    }

    function RecordListPane({ kind, items, activeId, onSelect, t }) {
      const title = kind === 'run' ? t('nav.runs') : t('nav.reports')
      return h(
        'div',
        { className: 'aps-collection' },
        h(
          'div',
          { className: 'aps-collection-head' },
          h('span', { className: 'aps-collection-title' }, title),
          h(DshTag, { tone: 'neutral' }, String(items.length)),
        ),
        h(
          'div',
          { className: 'aps-tree' },
          items.length === 0
            ? h('div', { className: 'aps-tree-empty' }, kind === 'run' ? t('run.empty') : t('report.empty'))
            : items.map((item) =>
                h(
                  DshButton,
                  {
                    key: item.id,
                    variant: 'ghost',
                    size: 'sm',
                    className: `aps-record-item ${activeId === item.id ? 'active' : ''}`,
                    onClick: () => onSelect(item.id),
                    title: item.title,
                  },
                  kind === 'run'
                    ? h(Pill, { tone: item.passed ? 'ok' : 'bad' }, item.passed ? t('run.passed') : t('run.failed'))
                    : h(Icon, { name: 'doc', size: 12 }),
                  h('span', { className: 'aps-record-name' }, item.title),
                  h(
                    'span',
                    { className: 'aps-record-meta' },
                    kind === 'run'
                      ? `${fmtTime(item.createdAt)} · ${fmtDuration(item.durationMs)}`
                      : fmtTime(item.createdAt),
                  ),
                ),
              ),
        ),
      )
    }

    function ResizableRows({ top, bottom, storageKey, initial = 430, min = 160, bottomMin = 190, max = 900, label }) {
      const rootRef = React.useRef(null)
      const [height, setHeight] = React.useState(() => readSplitWidth(storageKey, initial))
      const heightRef = React.useRef(height)
      React.useEffect(() => {
        heightRef.current = height
      }, [height])
      React.useEffect(() => {
        if (!storageKey) return
        setHeight(readSplitWidth(storageKey, initial))
      }, [storageKey, initial])
      const limit = (value) => {
        const containerHeight = rootRef.current ? rootRef.current.getBoundingClientRect().height : 800
        const upper = Math.max(min, Math.min(max, containerHeight - bottomMin - 6))
        return Math.max(min, Math.min(upper, value))
      }
      const persist = (value) => {
        try {
          window.localStorage.setItem(storageKey, String(value))
        } catch {
          // Ignore storage failures; dragging still works for this mount.
        }
      }
      React.useEffect(() => {
        const id = window.requestAnimationFrame(() => setHeight((value) => limit(value)))
        return () => window.cancelAnimationFrame(id)
      }, [])
      React.useEffect(() => {
        const element = rootRef.current
        if (!element || typeof ResizeObserver === 'undefined') return
        const observer = new ResizeObserver(() => setHeight((value) => limit(value)))
        observer.observe(element)
        return () => observer.disconnect()
      }, [])
      const set = (value, save = false) => {
        const next = limit(value)
        heightRef.current = next
        setHeight(next)
        if (save) persist(next)
      }
      const startDrag = (event) => {
        if (event.button !== undefined && event.button !== 0) return
        event.preventDefault()
        const handle = event.currentTarget
        handle.setPointerCapture?.(event.pointerId)
        handle.setAttribute('data-dragging', '')
        const startY = event.clientY
        const startHeight = heightRef.current
        const move = (moveEvent) => set(startHeight + moveEvent.clientY - startY)
        const stop = () => {
          document.removeEventListener('pointermove', move)
          document.removeEventListener('pointerup', stop)
          document.removeEventListener('pointercancel', stop)
          document.body.style.cursor = ''
          document.body.style.userSelect = ''
          handle.removeAttribute('data-dragging')
          persist(heightRef.current)
        }
        document.body.style.cursor = 'row-resize'
        document.body.style.userSelect = 'none'
        document.addEventListener('pointermove', move)
        document.addEventListener('pointerup', stop)
        document.addEventListener('pointercancel', stop)
      }
      const onKeyDown = (event) => {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown' && event.key !== 'Home' && event.key !== 'End') return
        event.preventDefault()
        if (event.key === 'Home') set(min, true)
        else if (event.key === 'End') set(max, true)
        else set(heightRef.current + (event.key === 'ArrowDown' ? 16 : -16), true)
      }
      return h(
        'div',
        { className: 'aps-vsplit', ref: rootRef },
        h('div', { className: 'aps-vsplit-top', style: { height: `${height}px`, flexBasis: `${height}px` } }, top),
        h('div', {
          className: 'aps-vsplit-handle',
          role: 'separator',
          'aria-orientation': 'horizontal',
          'aria-label': label,
          'aria-valuemin': min,
          'aria-valuemax': max,
          'aria-valuenow': height,
          tabIndex: 0,
          title: label,
          onPointerDown: startDrag,
          onKeyDown,
          onDoubleClick: () => set(initial, true),
        }),
        h('div', { className: 'aps-vsplit-bottom' }, bottom),
      )
    }

    function Browse({ collapsed, storageKey, label, children }) {
      const items = React.Children.toArray(children)
      return h(ResizableSplit, {
        left: items.length > 1 ? items[0] : null,
        right: items.length > 1 ? items[1] : items[0],
        collapsed,
        storageKey,
        label,
      })
    }

    function OpenTabs({ kind, ids, items, activeId, onSelect, onClose, onNew, onToggleCollection, t }) {
      const tabs = ids.map((id) => items.find((item) => item.id === id)).filter(Boolean)
      return h(
        'div',
        { className: 'aps-open-tabs' },
        h(
          DshTooltip,
          { label: t('collection.toggle') },
          h(DshButton, {
            variant: 'toolbar',
            size: 'sm',
            className: 'aps-panel-toggle',
            icon: h(Icon, { name: 'panel', size: 16 }),
            onClick: onToggleCollection,
            'aria-label': t('collection.toggle'),
          }),
        ),
        tabs.map((item) =>
          h(
            'div',
            {
              key: item.id,
              className: `aps-doc-tab ${activeId === item.id ? 'active' : ''}`,
              onAuxClick: (event) => {
                if (event.button === 1) {
                  event.preventDefault()
                  onClose(item.id)
                }
              },
            },
            h(
              DshButton,
              {
                variant: 'ghost',
                size: 'sm',
                className: 'aps-doc-main',
                onClick: () => onSelect(item.id),
                title: item.name,
                role: 'tab',
                'aria-selected': activeId === item.id,
                'aria-current': activeId === item.id ? 'page' : undefined,
              },
              h('span', { className: 'aps-doc-name' }, item.name),
            ),
            h(
              DshTooltip,
              { label: t('common.closeTab') },
              h(DshButton, {
                variant: 'toolbar',
                size: 'sm',
                className: 'aps-tab-close',
                icon: h(Icon, { name: 'x', size: 14 }),
                onClick: () => onClose(item.id),
                tabIndex: activeId === item.id ? 0 : -1,
                'aria-label': t('common.closeTab'),
              }),
            ),
          ),
        ),
        h(
          DshTooltip,
          { label: t(kind === 'flow' ? 'flow.new' : 'request.new') },
          h(DshButton, {
            variant: 'toolbar',
            size: 'sm',
            className: 'aps-tab-add',
            icon: h(Icon, { name: 'plus', size: 14 }),
            onClick: onNew,
            'aria-label': t(kind === 'flow' ? 'flow.new' : 'request.new'),
          }),
        ),
      )
    }

    function collectPlaceholders(value) {
      const text = JSON.stringify(value ?? '')
      const names = new Set()
      for (const match of text.matchAll(/\{\{\s*([^{}]+?)\s*\}\}/g)) {
        const name = match[1].trim()
        if (name.length > 0 && !name.startsWith('$')) names.add(name)
      }
      return [...names].sort()
    }

    function VariableInspector({ draft, workspace, environments, activeEnvironmentId, onClose, t }) {
      const placeholders = collectPlaceholders(draft)
      const environment = (environments || []).find((entry) => entry.id === activeEnvironmentId)
      const envVars = environment?.variables ?? {}
      const globalVars = workspace?.variables ?? workspace ?? {}
      const requestVars = draft.variables ?? {}
      const rows = placeholders.map((name) => {
        const hasRequest = Object.prototype.hasOwnProperty.call(requestVars, name)
        const hasEnvironment = Object.prototype.hasOwnProperty.call(envVars, name)
        const hasGlobal = Object.prototype.hasOwnProperty.call(globalVars, name)
        if (hasRequest) return { name, value: requestVars[name], source: t('inspect.request'), shadows: hasEnvironment || hasGlobal }
        if (hasEnvironment) return { name, value: envVars[name], source: t('inspect.environment'), shadows: hasGlobal }
        if (hasGlobal) return { name, value: globalVars[name], source: t('inspect.global') }
        return { name, value: '', source: t('inspect.missing'), missing: true }
      })
      return h(
        DshModal,
        { open: true, onClose, title: t('inspect.title'), closeLabel: t('common.close') },
        h(
          'div',
          { className: 'aps-vars-inspector' },
          rows.length === 0
            ? h(Empty, { title: t('inspect.none') })
            : h('table', { className: 'aps-table' }, h('thead', null, h('tr', null, h('th', null, 'Name'), h('th', null, 'Value'), h('th', null, 'Source'))), h('tbody', null, rows.map((row) => h('tr', { key: row.name, className: row.missing ? 'aps-vars-missing' : '' }, h('td', { className: 'aps-mono' }, row.name), h('td', { className: 'aps-mono' }, row.value === '' ? '—' : String(row.value)), h('td', null, h('span', { className: 'aps-vars-source' }, h(Pill, { tone: row.missing ? 'bad' : 'neutral' }, row.source), row.shadows ? h('span', { className: 'aps-vars-shadow' }, t('inspect.overrides')) : null)))))),
          h('div', { className: 'aps-muted', style: { fontSize: 11 } }, `${t('inspect.environment')}: ${environment?.name || '—'} · ${t('inspect.global')}: ${Object.keys(globalVars).length} · ${t('inspect.request')}: ${Object.keys(requestVars).length}`),
        ),
      )
    }

    function RelationsModal({ request, flows, runs, call, onClose, onOpenCases, onOpenFlow, onOpenRun, onOpenHistory, t }) {
      const [historyCount, setHistoryCount] = React.useState(null)
      const [zoom, setZoom] = React.useState(1)
      const [layout, setLayout] = React.useState('radial')
      const [pan, setPan] = React.useState({ x: 0, y: 0 })
      const dragRef = React.useRef(null)
      React.useEffect(() => {
        let cancelled = false
        call('list_history', { requestId: request.id })
          .then((data) => { if (!cancelled) setHistoryCount(Array.isArray(data.items) ? data.items.length : 0) })
          .catch(() => { if (!cancelled) setHistoryCount(0) })
        return () => { cancelled = true }
      }, [call, request.id])
      const linkedFlows = (flows || []).filter((flow) => flow.steps?.some((step) => step.requestId === request.id))
      const linkedRuns = (runs || []).filter((run) => run.requestId === request.id).slice(0, 6)
      const empty = (request.cases || []).length === 0 && linkedFlows.length === 0 && linkedRuns.length === 0 && historyCount === 0
      const tree = layout === 'tree'
      const centerX = tree ? 86 : 210
      const centerY = tree ? 95 : 86
      const graphNodes = [
        { key: 'cases', x: tree ? 340 : 76, y: tree ? 26 : 34, count: (request.cases || []).length, label: t('relations.cases'), action: () => { onClose(); onOpenCases() } },
        { key: 'flows', x: tree ? 340 : 344, y: tree ? 72 : 34, count: linkedFlows.length, label: t('relations.flows'), action: linkedFlows[0] ? () => { onClose(); onOpenFlow(linkedFlows[0].id) } : undefined },
        { key: 'runs', x: tree ? 340 : 76, y: tree ? 118 : 138, count: linkedRuns.length, label: t('relations.runs'), action: linkedRuns[0] ? () => { onClose(); onOpenRun(linkedRuns[0].id) } : undefined },
        { key: 'history', x: tree ? 340 : 344, y: tree ? 164 : 138, count: historyCount ?? '…', label: t('relations.history'), action: historyCount > 0 ? () => { onClose(); onOpenHistory() } : undefined },
      ]
      return h(
        DshModal,
        { open: true, onClose, title: t('relations.title'), closeLabel: t('common.close') },
        h(
          'div',
          { className: 'aps-relations' },
          empty ? h(Empty, { title: t('relations.empty') }) : h(
            'div',
            { className: 'aps-rel-graph-wrap' },
            h('div', { className: 'aps-rel-controls' }, h(Button, { size: 'small', tone: 'ghost', onClick: () => { setLayout((current) => current === 'radial' ? 'tree' : 'radial'); setPan({ x: 0, y: 0 }) } }, layout === 'radial' ? t('relations.layoutRadial') : t('relations.layoutTree')), h(Button, { size: 'small', tone: 'ghost', onClick: () => setZoom((value) => Math.min(2, value + 0.15)) }, '+'), h(Button, { size: 'small', tone: 'ghost', onClick: () => setZoom((value) => Math.max(0.6, value - 0.15)) }, '−'), h(Button, { size: 'small', tone: 'ghost', onClick: () => { setZoom(1); setPan({ x: 0, y: 0 }) } }, t('relations.resetZoom')), h('span', { className: 'aps-muted', style: { fontSize: 10 } }, `${Math.round(zoom * 100)}%`)),
            h(
            'svg',
            { viewBox: `0 0 420 ${tree ? 190 : 172}`, className: 'aps-rel-graph', role: 'img', 'aria-label': t('relations.title'), onPointerDown: (event) => { dragRef.current = { x: event.clientX, y: event.clientY, px: pan.x, py: pan.y }; event.currentTarget.setPointerCapture?.(event.pointerId) }, onPointerMove: (event) => { if (!dragRef.current) return; setPan({ x: dragRef.current.px + event.clientX - dragRef.current.x, y: dragRef.current.py + event.clientY - dragRef.current.y }) }, onPointerUp: () => { dragRef.current = null }, onPointerLeave: () => { dragRef.current = null } },
            h('g', { transform: `translate(${centerX + pan.x} ${centerY + pan.y}) scale(${zoom}) translate(-${centerX} -${centerY})` },
            graphNodes.map((node) => h('line', { key: `edge-${node.key}`, x1: centerX, y1: centerY, x2: node.x, y2: node.y, className: 'aps-rel-edge' })),
            graphNodes.map((node) => h(
              'g',
              { key: node.key, className: `aps-rel-node-group ${node.action ? 'clickable' : ''}`, onClick: node.action, style: { cursor: node.action ? 'pointer' : 'default' } },
              h('title', null, `${node.label}: ${node.count}`),
              h('circle', { cx: node.x, cy: node.y, r: 25, className: 'aps-rel-node' }),
              h('text', { x: node.x, y: node.y - 1, textAnchor: 'middle', className: 'aps-rel-count' }, String(node.count)),
              h('text', { x: node.x, y: node.y + 12, textAnchor: 'middle', className: 'aps-rel-label' }, node.label),
            )),
            h('circle', { cx: centerX, cy: centerY, r: 34, className: 'aps-rel-center' }),
            h('text', { x: centerX, y: centerY - 4, textAnchor: 'middle', className: 'aps-rel-center-label' }, t('relations.title')),
            h('text', { x: centerX, y: centerY + 11, textAnchor: 'middle', className: 'aps-rel-center-name' }, truncate(request.name, 22)),
            ),
            ),
          ),
          (request.cases || []).length > 0
            ? h('div', { className: 'aps-relations-section' }, h('div', { className: 'aps-section-title' }, `${t('relations.cases')} (${request.cases.length})`), request.cases.map((entry) => h('div', { className: 'aps-relations-row', key: entry.id }, h(Icon, { name: 'cases', size: 13 }), h('span', { className: 'aps-relations-name' }, entry.name))), h(Button, { size: 'small', tone: 'ghost', onClick: () => { onClose(); onOpenCases() } }, t('relations.cases')))
            : null,
          linkedFlows.length > 0
            ? h('div', { className: 'aps-relations-section' }, h('div', { className: 'aps-section-title' }, `${t('relations.flows')} (${linkedFlows.length})`), linkedFlows.map((flow) => h(Button, { key: flow.id, size: 'small', tone: 'ghost', icon: 'play', onClick: () => { onClose(); onOpenFlow(flow.id) } }, flow.name)))
            : null,
          linkedRuns.length > 0
            ? h('div', { className: 'aps-relations-section' }, h('div', { className: 'aps-section-title' }, `${t('relations.runs')} (${linkedRuns.length})`), linkedRuns.map((run) => h(Button, { key: run.id, size: 'small', tone: 'ghost', icon: 'history', onClick: () => { onClose(); onOpenRun(run.id) } }, `${run.passed ? '✓' : '✕'} ${run.title || run.requestName || run.id}`)))
            : null,
          h('div', { className: 'aps-relations-section' }, h('div', { className: 'aps-section-title' }, `${t('relations.history')} (${historyCount ?? '…'})`), h(Button, { size: 'small', tone: 'ghost', icon: 'history', onClick: () => { onClose(); onOpenHistory() }, disabled: historyCount === 0 }, t('relations.openHistory'))),
        ),
      )
    }

    function CasesModal({ request, onChange, onRun, onClose, t }) {
      const [cases, setCases] = React.useState(() => clone(Array.isArray(request.cases) ? request.cases : []))
      const [selectedId, setSelectedId] = React.useState(() => cases[0]?.id ?? null)
      const selected = cases.find((entry) => entry.id === selectedId) ?? cases[0]
      const update = (value) => {
        if (!selected) return
        setCases((current) => current.map((entry) => (entry.id === selected.id ? { ...entry, ...value } : entry)))
      }
      const add = () => {
        const id = `case-${Date.now().toString(36)}`
        const next = { id, name: `Case ${cases.length + 1}`, overrides: {} }
        setCases((current) => [...current, next])
        setSelectedId(id)
      }
      const duplicate = () => {
        if (!selected) return
        const id = `case-${Date.now().toString(36)}`
        const next = { ...clone(selected), id, name: uniqueName(`${selected.name} copy`, cases.map((entry) => entry.name)) }
        setCases((current) => [...current, next])
        setSelectedId(id)
      }
      const remove = () => {
        if (!selected) return
        const next = cases.filter((entry) => entry.id !== selected.id)
        setCases(next)
        setSelectedId(next[0]?.id ?? null)
      }
      const apply = () => {
        onChange(cases)
        onClose()
      }
      return h(
        DshModal,
        { open: true, onClose, title: t('cases.title'), closeLabel: t('common.close') },
        h(
          'div',
          { className: 'aps-cases' },
          h(
            'div',
            { className: 'aps-cases-list' },
            cases.map((entry) => h(
              DshButton,
              {
                key: entry.id,
                variant: 'ghost',
                size: 'sm',
                className: `aps-case-row ${selected?.id === entry.id ? 'active' : ''}`,
                onClick: () => setSelectedId(entry.id),
              },
              h(Icon, { name: 'cases', size: 13 }),
              h('span', { className: 'aps-case-name' }, entry.name),
            )),
            h(Button, { size: 'small', tone: 'ghost', icon: 'plus', onClick: add }, t('cases.new')),
          ),
          cases.length === 0
            ? h(Empty, { title: t('cases.empty') })
            : h(
                'div',
                { className: 'aps-cases-editor' },
                h(Field, { label: t('cases.name') }, h(TextInput, { value: selected.name, onChange: (value) => update({ name: value }) })),
                h(Field, { label: t('cases.overrides') }, h(JsonObjectField, {
                  key: selected.id,
                  value: selected.overrides || {},
                  onChange: (value) => update({ overrides: value }),
                  onApply: (value) => update({ overrides: value }),
                  applyLabel: t('common.apply'),
                  rows: 8,
                })),
                h('div', { className: 'aps-project-hint' }, t('cases.hint')),
                h('div', { className: 'aps-project-actions' },
                  h(Button, { size: 'small', tone: 'danger', onClick: remove }, t('cases.delete')),
                  h(Button, { size: 'small', tone: 'ghost', icon: 'copy', onClick: duplicate }, t('cases.duplicate')),
                  h(Button, { size: 'small', onClick: apply }, t('cases.save')),
                  h(Button, { tone: 'primary', icon: 'play', onClick: () => { onChange(cases); onRun(cases, selected); onClose() } }, t('cases.run')),
                ),
              ),
        ),
      )
    }

    function HistoryModal({ requestId, call, onClose, onRestored, notify, t }) {
      const [items, setItems] = React.useState(null)
      const [busy, setBusy] = React.useState(false)
      React.useEffect(() => {
        let cancelled = false
        call('list_history', { requestId })
          .then((data) => { if (!cancelled) setItems(Array.isArray(data.items) ? data.items : []) })
          .catch((reason) => { if (!cancelled) { setItems([]); notify(reason instanceof Error ? reason.message : String(reason), 'bad') } })
        return () => { cancelled = true }
      }, [call, requestId])
      const restore = async (revisionId) => {
        if (busy) return
        setBusy(true)
        try {
          await call('restore_history', { requestId, revisionId })
          await onRestored()
          notify(t('history.restored'))
          onClose()
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        } finally {
          setBusy(false)
        }
      }
      return h(
        DshModal,
        { open: true, onClose, title: t('history.title'), closeLabel: t('common.close') },
        h(
          'div',
          { className: 'aps-history' },
          items === null
            ? h(Loading, { label: t('common.loading') })
            : items.length === 0
              ? h(Empty, { title: t('history.empty') })
              : items.map((item) => h(
                  'div',
                  { className: 'aps-history-row', key: item.revisionId },
                  h('span', { className: `aps-method ${methodClass(item.method)}` }, item.method || 'GET'),
                  h(
                    'span',
                    { className: 'aps-history-main' },
                    h('span', { className: 'aps-history-name' }, item.name || requestId),
                    h('span', { className: 'aps-history-meta' }, `${item.url || ''} · ${fmtTime(item.updatedAt)}`),
                  ),
                  h(Button, { size: 'small', tone: 'ghost', onClick: () => restore(item.revisionId), disabled: busy }, t('history.restore')),
                )),
        ),
      )
    }

    function BulkVariablesModal({ title, onApply, onClose, t }) {
      const [text, setText] = React.useState('')
      const parsed = (() => {
        const values = {}
        let invalid = 0
        for (const line of text.split(/\r?\n/)) {
          const trimmed = line.trim()
          if (trimmed.length === 0 || trimmed.startsWith('#')) continue
          const equals = trimmed.indexOf('=')
          if (equals <= 0) { invalid += 1; continue }
          const key = trimmed.slice(0, equals).trim()
          if (key.length === 0) { invalid += 1; continue }
          values[key] = trimmed.slice(equals + 1).trim()
        }
        return { values, invalid }
      })()
      return h(
        DshModal,
        { open: true, onClose, title, closeLabel: t('common.close') },
        h(
          'div',
          { className: 'aps-bulk-vars' },
          h(TextArea, { value: text, onChange: setText, rows: 10, mono: true, language: 'plaintext', placeholder: 'baseUrl=https://api.example.com' }),
          h('div', { className: 'aps-muted', style: { fontSize: 11 } }, t('project.bulkHint')),
          h('div', { className: 'aps-muted', style: { fontSize: 11 } }, t('project.bulkPreview', { count: Object.keys(parsed.values).length, invalid: parsed.invalid })),
          Object.keys(parsed.values).length > 0
            ? h('div', { className: 'aps-bulk-preview' }, h('table', { className: 'aps-table' }, h('thead', null, h('tr', null, h('th', null, 'Key'), h('th', null, 'Value'))), h('tbody', null, Object.entries(parsed.values).map(([key, value]) => h('tr', { key }, h('td', { className: 'aps-mono' }, key), h('td', { className: 'aps-mono' }, value))))))
            : null,
          h('div', { className: 'aps-project-actions' }, h(Button, { tone: 'primary', icon: 'save', onClick: () => onApply(parsed.values), disabled: Object.keys(parsed.values).length === 0 }, t('project.bulkApply'))),
        ),
      )
    }

    function ProjectModal({ boot, call, onClose, onRefresh, onImported, selectedRequestId, notify, t, initialTab = 'env' }) {
      const [tab, setTab] = React.useState(initialTab)
      const [environments, setEnvironments] = React.useState(() => clone(boot.environments?.length ? boot.environments : [{ id: 'env-default', name: 'Default', variables: {} }]))
      const [activeEnvironmentId, setActiveEnvironmentId] = React.useState(boot.activeEnvironmentId || environments[0].id)
      const [selectedId, setSelectedId] = React.useState(activeEnvironmentId)
      const [globalVariables, setGlobalVariables] = React.useState(() => clone(boot.workspace || {}))
      const [globalHeadersText, setGlobalHeadersText] = React.useState(() => JSON.stringify(boot.globalHeaders || [], null, 2))
      const [globalQueryText, setGlobalQueryText] = React.useState(() => JSON.stringify(boot.globalQuery || [], null, 2))
      const [saving, setSaving] = React.useState(false)
      const [action, setAction] = React.useState('import')
      const [source, setSource] = React.useState('auto')
      const [mergeStrategy, setMergeStrategy] = React.useState('merge')
      const [envSearch, setEnvSearch] = React.useState('')
      const [globalSearch, setGlobalSearch] = React.useState('')
      const [bulkTarget, setBulkTarget] = React.useState(null)
      const [target, setTarget] = React.useState('openapi')
      const [input, setInput] = React.useState('')
      const [output, setOutput] = React.useState('')
      const [filename, setFilename] = React.useState('')
      const [busy, setBusy] = React.useState(false)
      const selected = environments.find((entry) => entry.id === selectedId) || environments[0]
      const patchEnvironment = (patch) => {
        setEnvironments((current) => current.map((entry) => (entry.id === selectedId ? { ...entry, ...patch } : entry)))
      }
      const addEnvironment = () => {
        const id = `env-${Date.now().toString(36)}`
        const next = { id, name: 'New environment', variables: {} }
        setEnvironments((current) => [...current, next])
        setActiveEnvironmentId(id)
        setSelectedId(id)
      }
      const duplicateEnvironment = () => {
        const id = `env-${Date.now().toString(36)}`
        const next = { ...selected, id, name: uniqueName(`${selected.name} copy`, environments.map((entry) => entry.name)), variables: clone(selected.variables || {}) }
        setEnvironments((current) => [...current, next])
        setSelectedId(id)
        setActiveEnvironmentId(id)
      }
      const removeEnvironment = () => {
        if (environments.length <= 1) return
        const next = environments.filter((entry) => entry.id !== selectedId)
        setEnvironments(next)
        if (activeEnvironmentId === selectedId) setActiveEnvironmentId(next[0].id)
        setSelectedId(next[0].id)
      }
      const save = async () => {
        if (saving) return
        let globalHeaders
        let globalQuery
        try {
          globalHeaders = JSON.parse(globalHeadersText || '[]')
          globalQuery = JSON.parse(globalQueryText || '[]')
          if (!Array.isArray(globalHeaders) || !Array.isArray(globalQuery)) throw new Error('must be arrays')
        } catch {
          notify('Global headers and query must be JSON arrays', 'bad')
          return
        }
        setSaving(true)
        try {
          await call('save_environments', {
            environments,
            activeEnvironmentId,
            variables: globalVariables,
            globalHeaders,
            globalQuery,
          })
          await onRefresh()
          notify(t('project.saved'))
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        } finally {
          setSaving(false)
        }
      }
      const importPreview = (() => {
        if (action !== 'import' || (source !== 'postman-env' && source !== 'insomnia-env') || input.trim().length === 0) return null
        let document
        try { document = JSON.parse(input) } catch { return null }
        const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
        const entries = source === 'postman-env'
          ? (Array.isArray(document.values) ? document.values : [])
          : (isRecord(document.data) ? Object.entries(document.data).map(([key, value]) => ({ key, value })) : [])
        const current = selected?.variables ?? {}
        const rows = entries.filter((entry) => entry !== null && typeof entry === 'object' && typeof entry.key === 'string' && entry.enabled !== false).map((entry) => {
          const key = entry.key.trim()
          const value = String(entry.value ?? '')
          if (key.length === 0) return null
          if (!Object.prototype.hasOwnProperty.call(current, key)) return { key, current: '—', value, status: t('project.previewNew') }
          if (String(current[key]) !== value) return { key, current: String(current[key]), value, status: t('project.previewUpdated') }
          return { key, current: String(current[key]), value, status: t('project.previewSame') }
        }).filter(Boolean)
        if (rows.length === 0) return null
        return {
          rows,
          newCount: rows.filter((row) => row.status === t('project.previewNew')).length,
          updatedCount: rows.filter((row) => row.status === t('project.previewUpdated')).length,
          sameCount: rows.filter((row) => row.status === t('project.previewSame')).length,
        }
      })()
      const runImport = async () => {
        if (busy || input.trim().length === 0) return
        setBusy(true)
        try {
          const data = await call('import_data', { source, text: input, mergeStrategy })
          await onRefresh()
          notify(t('project.imported', { count: data.count }))
          onImported(data.requests)
          onClose()
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        } finally {
          setBusy(false)
        }
      }
      const runExport = async () => {
        if (busy) return
        setBusy(true)
        try {
          const data = await call('export_data', { target, requestId: selectedRequestId || undefined })
          setOutput(data.data || '')
          setFilename(data.filename || 'airpost-export')
          notify(t('project.exported'))
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        } finally {
          setBusy(false)
        }
      }
      const copyOutput = async () => {
        try {
          await navigator.clipboard.writeText(output)
          notify(t('project.copyDone'))
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        }
      }
      const downloadOutput = () => {
        const blob = new Blob([output], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename || 'airpost-export'
        document.body.append(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
      }
      const importOptions = [
        { value: 'auto', label: 'Auto detect' },
        { value: 'curl', label: 'cURL' },
        { value: 'openapi', label: 'OpenAPI / Swagger JSON/YAML' },
        { value: 'postman', label: 'Postman Collection JSON' },
        { value: 'postman-env', label: 'Postman Environment JSON' },
        { value: 'postman-env', label: 'Postman Environment JSON' },
        { value: 'har', label: 'HAR JSON' },
        { value: 'insomnia', label: 'Insomnia JSON' },
        { value: 'insomnia-env', label: 'Insomnia Environment JSON' },
        { value: 'insomnia-env', label: 'Insomnia Environment JSON' },
        { value: 'yapi', label: 'YApi JSON' },
        { value: 'workspace', label: 'AirPost Workspace JSON' },
        { value: 'insomnia', label: 'Insomnia JSON' },
        { value: 'yapi', label: 'YApi JSON' },
      ]
      const exportOptions = [
        { value: 'openapi', label: 'OpenAPI JSON' },
        { value: 'postman', label: 'Postman Collection JSON' },
        { value: 'markdown', label: 'Markdown API Docs' },
        { value: 'html', label: 'HTML API Docs' },
        { value: 'workspace', label: 'AirPost Workspace JSON' },
        { value: 'curl', label: 'cURL（当前接口）' },
      ]
      return h(
        DshModal,
        { open: true, onClose, title: t('project.title'), closeLabel: t('common.close') },
        h(
          'div',
          { className: 'aps-project' },
          h(DshSegmentedTabs, {
            className: 'aps-project-tabs',
            label: t('project.title'),
            items: [{ value: 'env', label: t('project.env') }, { value: 'transfer', label: t('project.transfer') }],
            value: tab,
            onChange: setTab,
          }),
          tab === 'env'
            ? h(
                'div',
                { className: 'aps-project-section' },
                h(
                  'div',
                  { className: 'aps-project-row' },
                  h(Field, { label: t('project.active') }, h(Select, {
                    value: activeEnvironmentId,
                    onChange: (id) => { setActiveEnvironmentId(id); setSelectedId(id) },
                    options: environments.map((entry) => ({ value: entry.id, label: entry.name })),
                  })),
                  h(Button, { size: 'small', tone: 'ghost', icon: 'plus', onClick: addEnvironment }, t('project.newEnv')),
                  h(Button, { size: 'small', tone: 'ghost', icon: 'copy', onClick: duplicateEnvironment }, t('project.duplicateEnv')),
                  h(Button, { size: 'small', tone: 'danger', onClick: removeEnvironment, disabled: environments.length <= 1 }, t('project.deleteEnv')),
                ),
                h(Field, { label: t('project.envName') }, h(TextInput, { value: selected.name, onChange: (value) => patchEnvironment({ name: value }) })),
                h(Field, { label: t('project.envVars') }, h(
                  'div',
                  { className: 'aps-env-vars' },
                  h('div', { className: 'aps-field-row' }, h(TextInput, { value: envSearch, onChange: setEnvSearch, placeholder: t('project.envSearch') }), h(Button, { size: 'small', tone: 'ghost', icon: 'plus', onClick: () => setBulkTarget('env') }, t('project.bulkPaste'))),
                  h(ValueTable, {
                    rows: Object.entries(selected.variables || {}).filter(([key]) => key.toLowerCase().includes(envSearch.trim().toLowerCase())).map(([key, value]) => ({ key, value: String(value), enabled: true })),
                    onChange: (rows) => {
                      const visible = new Set(Object.entries(selected.variables || {}).filter(([key]) => key.toLowerCase().includes(envSearch.trim().toLowerCase())).map(([key]) => key))
                      const next = { ...(selected.variables || {}) }
                      for (const key of visible) delete next[key]
                      for (const row of rows) if (row.key.trim().length > 0) next[row.key.trim()] = String(row.value ?? '')
                      patchEnvironment({ variables: next })
                    },
                    addLabel: t('project.addEnvVar'),
                    keyPlaceholder: 'key',
                    valuePlaceholder: 'value',
                  }),
                )),
                h(Field, { label: t('project.globalVars') }, h(
                  'div',
                  { className: 'aps-env-vars' },
                  h('div', { className: 'aps-field-row' }, h(TextInput, { value: globalSearch, onChange: setGlobalSearch, placeholder: t('project.globalSearch') }), h(Button, { size: 'small', tone: 'ghost', icon: 'plus', onClick: () => setBulkTarget('global') }, t('project.bulkPaste'))),
                  h(ValueTable, {
                    rows: Object.entries(globalVariables || {}).filter(([key]) => key.toLowerCase().includes(globalSearch.trim().toLowerCase())).map(([key, value]) => ({ key, value: String(value), enabled: true })),
                    onChange: (rows) => {
                      const visible = new Set(Object.entries(globalVariables || {}).filter(([key]) => key.toLowerCase().includes(globalSearch.trim().toLowerCase())).map(([key]) => key))
                      const next = { ...(globalVariables || {}) }
                      for (const key of visible) delete next[key]
                      for (const row of rows) if (row.key.trim().length > 0) next[row.key.trim()] = String(row.value ?? '')
                      setGlobalVariables(next)
                    },
                    addLabel: t('project.addGlobalVar'),
                    keyPlaceholder: 'key',
                    valuePlaceholder: 'value',
                  }),
                )),
                h(Field, { label: t('project.globalHeaders') }, h(TextArea, {
                  value: globalHeadersText,
                  onChange: setGlobalHeadersText,
                  rows: 4,
                  language: 'json',
                  mono: true,
                  placeholder: '[{ "key": "X-Project", "value": "airpost", "enabled": true }]',
                })),
                h(Field, { label: t('project.globalQuery') }, h(TextArea, {
                  value: globalQueryText,
                  onChange: setGlobalQueryText,
                  rows: 4,
                  language: 'json',
                  mono: true,
                  placeholder: '[{ "key": "source", "value": "airpost", "enabled": true }]',
                })),
                h('div', { className: 'aps-project-actions' }, h(Button, { tone: 'primary', icon: 'save', onClick: save, disabled: saving }, saving ? t('common.loading') : t('project.save'))),
              )
            : h(
                'div',
                { className: 'aps-project-section' },
                h(
                  'div',
                  { className: 'aps-project-row' },
                  h(Field, { label: t('project.action') }, h(Select, {
                    value: action,
                    onChange: setAction,
                    options: [{ value: 'import', label: t('project.import') }, { value: 'export', label: t('project.export') }],
                  })),
                  action === 'import'
                    ? h(Field, { label: t('project.source') }, h(Select, { value: source, onChange: setSource, options: importOptions }))
                    : h(Field, { label: t('project.target') }, h(Select, { value: target, onChange: setTarget, options: exportOptions })),
                ),
                action === 'import' && (source === 'postman-env' || source === 'insomnia-env') ? h(Field, { label: t('project.mergeStrategy') }, h(Select, { value: mergeStrategy, onChange: setMergeStrategy, options: [{ value: 'merge', label: t('project.merge') }, { value: 'replace', label: t('project.replace') }] })) : null,
                h('div', { className: 'aps-project-hint' }, action === 'import' ? t('project.importHint') : t('project.exportHint')),
                action === 'import'
                  ? h(React.Fragment, null,
                      h(TextArea, { value: input, onChange: setInput, rows: 12, language: source === 'curl' ? 'plaintext' : 'json', placeholder: t('project.importHint') }),
                      importPreview ? h('div', { className: 'aps-import-preview' }, h('div', { className: 'aps-field-row' }, h('span', { className: 'aps-section-title' }, t('project.importPreview')), h('span', { className: 'aps-muted', style: { fontSize: 11 } }, t('project.previewSummary', { newCount: importPreview.newCount, updatedCount: importPreview.updatedCount, sameCount: importPreview.sameCount }))), h('table', { className: 'aps-table' }, h('thead', null, h('tr', null, h('th', null, 'Name'), h('th', null, 'Current'), h('th', null, 'Imported'), h('th', null, 'Status'))), h('tbody', null, importPreview.rows.map((row) => h('tr', { key: row.key }, h('td', { className: 'aps-mono' }, row.key), h('td', { className: 'aps-mono' }, row.current), h('td', { className: 'aps-mono' }, row.value), h('td', null, h(Pill, { tone: row.status === t('project.previewSame') ? 'neutral' : 'ok' }, row.status))))))) : null,
                      h('div', { className: 'aps-project-actions' }, h(Button, { tone: 'primary', icon: 'download', onClick: runImport, disabled: busy || input.trim().length === 0 }, busy ? t('common.loading') : t('project.import'))),
                    )
                  : h(React.Fragment, null,
                      h('div', { className: 'aps-project-actions' }, h(Button, { tone: 'primary', icon: 'download', onClick: runExport, disabled: busy }, busy ? t('common.loading') : t('project.export'))),
                      output
                        ? h(React.Fragment, null,
                            h(Field, { label: t('project.output') }, h(TextArea, { value: output, onChange: setOutput, rows: 12, language: target === 'curl' || target === 'markdown' || target === 'html' ? 'plaintext' : 'json', readOnly: true })),
                            h('div', { className: 'aps-project-actions' },
                              h(Button, { size: 'small', icon: 'copy', onClick: copyOutput }, t('project.copy')),
                              h(Button, { size: 'small', icon: 'download', onClick: downloadOutput }, t('project.download')),
                            ),
                          )
                        : null,
                    ),
              ),
              bulkTarget ? h(BulkVariablesModal, {
                title: bulkTarget === 'env' ? t('project.envVars') : t('project.globalVars'),
                onClose: () => setBulkTarget(null),
                onApply: (values) => {
                  if (bulkTarget === 'env') patchEnvironment({ variables: { ...(selected.variables || {}), ...values } })
                  else setGlobalVariables((current) => ({ ...(current || {}), ...values }))
                  setBulkTarget(null)
                },
                t,
              }) : null,
        ),
      )
    }

    function docsText(request) {
      return [
        request.name,
        request.url,
        request.description,
        request.method,
        request.body?.text,
        ...(request.tests || []).map((test) => `${test.type} ${test.path || ''} ${test.value || ''} ${test.name || ''}`),
        ...(request.cases || []).map((entry) => entry.name),
      ].filter(Boolean).join(' ').toLowerCase()
    }

    function DocsHighlight({ text, query }) {
      const value = String(text ?? '')
      const needle = query.trim()
      if (needle.length === 0) return h(React.Fragment, null, value)
      const parts = []
      const lower = value.toLowerCase()
      const target = needle.toLowerCase()
      let index = 0
      let position = lower.indexOf(target)
      while (position >= 0) {
        if (position > index) parts.push(value.slice(index, position))
        parts.push(h('mark', { className: 'aps-highlight', key: `${position}-${parts.length}` }, value.slice(position, position + needle.length)))
        index = position + needle.length
        position = lower.indexOf(target, index)
      }
      if (index < value.length) parts.push(value.slice(index))
      return h(React.Fragment, null, parts)
    }

    function DocsExamples({ examples, requestId, t }) {
      const [index, setIndex] = React.useState(0)
      const [copied, setCopied] = React.useState(false)
      const [showHeaders, setShowHeaders] = React.useState(false)
      const [linkCopied, setLinkCopied] = React.useState(false)
      if (!Array.isArray(examples) || examples.length === 0) return null
      const safeIndex = Math.min(index, examples.length - 1)
      const example = examples[safeIndex]
      const copy = async () => {
        try {
          await navigator.clipboard.writeText(example.body || '')
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1500)
        } catch {}
      }
      const downloadExample = () => {
        const esc = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        const sections = examples.map((entry, position) => {
          const headerRows = (entry.headers || []).filter((item) => item.enabled !== false).map((item) => `<tr><td>${esc(item.key)}</td><td>${esc(item.value)}</td></tr>`).join('')
          return `<details ${position === safeIndex ? 'open' : ''}><summary>${esc(entry.name)} · HTTP ${esc(entry.status)}</summary>${headerRows ? `<h3 data-en="Headers" data-zh="响应头">Headers</h3><table><thead><tr><th>Name</th><th>Value</th></tr></thead><tbody>${headerRows}</tbody></table>` : ''}<h3 data-en="Body" data-zh="响应体">Body</h3><pre>${esc(entry.body || '')}</pre></details>`
        }).join('')
        const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(example.name)}</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;max-width:900px;margin:36px auto;padding:0 20px;color:#1f2328}code,pre{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:#f6f8fa;border-radius:6px}pre{padding:12px;overflow:auto}table{border-collapse:collapse}td,th{border:1px solid #d0d7de;padding:4px 8px;text-align:left;font-size:12px}details{border:1px solid #d0d7de;border-radius:8px;padding:8px 12px;margin:10px 0}summary{cursor:pointer;font-weight:600;font-size:13px}h3{font-size:13px}.meta{color:#57606a;font-size:12px}#filter{width:100%;box-sizing:border-box;padding:8px 10px;border:1px solid #d0d7de;border-radius:6px;font-size:13px;margin:8px 0}.theme{position:fixed;right:16px;top:16px;border:1px solid #d0d7de;background:#fff;border-radius:6px;padding:4px 8px;cursor:pointer}body.dark{background:#0d1117;color:#e6edf3}body.dark .meta{color:#8b949e}body.dark details{border-color:#30363d}body.dark pre{background:#161b22;color:#e6edf3}body.dark table td,body.dark table th{border-color:#30363d}body.dark #filter{background:#0d1117;color:#e6edf3;border-color:#30363d}body.dark .theme{background:#161b22;color:#e6edf3;border-color:#30363d}.lang{right:64px}@media (prefers-color-scheme: dark){body{background:#0d1117;color:#e6edf3}.meta{color:#8b949e}details{border-color:#30363d}pre{background:#161b22;color:#e6edf3}table td,th{border-color:#30363d}#filter{background:#0d1117;color:#e6edf3;border-color:#30363d}}</style></head><body><button id="lang" class="theme lang">中/EN</button><button id="theme" class="theme">◐</button><h1>${esc(example.name)}</h1><p class="meta" id="meta">${examples.length} response example(s) · AirPost</p><input id="filter" placeholder="Filter examples" /><div id="examples">${sections}</div><script>document.getElementById('theme').addEventListener('click',function(){document.body.classList.toggle('dark')});document.getElementById('lang').addEventListener('click',function(){var zh=document.documentElement.lang!=='zh-CN';document.documentElement.lang=zh?'zh-CN':'en';document.querySelectorAll('[data-en]').forEach(function(node){node.textContent=zh?node.getAttribute('data-zh'):node.getAttribute('data-en')});document.getElementById('meta').textContent=zh?(document.querySelectorAll('details').length+' 个响应示例 · AirPost'):(document.querySelectorAll('details').length+' response example(s) · AirPost');document.getElementById('filter').placeholder=zh?'筛选示例':'Filter examples'});document.getElementById('filter').addEventListener('input',function(event){var query=event.target.value.toLowerCase();document.querySelectorAll('details').forEach(function(item){item.hidden=query.length>0&&!item.textContent.toLowerCase().includes(query)})})</script></body></html>`
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${(example.name || 'example').replace(/[^a-zA-Z0-9_-]+/g, '-')}.html`
        document.body.append(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
      }

      const copyLink = async () => {
        try {
          await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#request-${requestId}-examples`)
          setLinkCopied(true)
          window.setTimeout(() => setLinkCopied(false), 1500)
        } catch {}
      }
      return h(
        'div',
        { className: 'aps-doc-example-viewer' },
        h(
          'div',
          { className: 'aps-doc-example-toolbar' },
          h(Select, {
            value: safeIndex,
            onChange: (value) => setIndex(Number(value)),
            options: examples.map((entry, position) => ({ value: position, label: `${entry.name} · ${entry.status}` })),
          }),
          h(Pill, { tone: 'neutral' }, String(example.status)),
          h('span', { className: 'aps-doc-example-name' }, example.name),
          h('span', { className: 'aps-tab-spacer' }),
          h('span', { className: 'aps-muted', style: { fontSize: 10 } }, `${safeIndex + 1}/${examples.length}`),
          h(IconButton, { name: 'up', title: 'Previous example', onClick: () => setIndex((safeIndex - 1 + examples.length) % examples.length) }),
          h(IconButton, { name: 'down', title: 'Next example', onClick: () => setIndex((safeIndex + 1) % examples.length) }),
          (example.headers || []).length > 0 ? h(Button, { size: 'small', tone: 'ghost', onClick: () => setShowHeaders((current) => !current) }, showHeaders ? t('docs.hideHeaders') : `${t('docs.showHeaders')} (${(example.headers || []).length})`) : null,
          h(IconButton, { name: 'copy', title: copied ? t('docs.exampleCopied') : t('docs.copyExample'), onClick: copy }),
          h(IconButton, { name: 'link', title: linkCopied ? t('docs.exampleLinkCopied') : t('docs.copyExampleLink'), onClick: copyLink }),
          h(IconButton, { name: 'download', title: t('docs.downloadExample'), onClick: downloadExample }),
        ),
        showHeaders && (example.headers || []).length > 0 ? h('table', { className: 'aps-table aps-doc-example-headers' }, h('thead', null, h('tr', null, h('th', null, 'Name'), h('th', null, 'Value'))), h('tbody', null, example.headers.filter((entry) => entry.enabled !== false).map((entry, position) => h('tr', { key: position }, h('td', { className: 'aps-mono' }, entry.key), h('td', { className: 'aps-mono' }, entry.value))))) : null,
        h('pre', { className: 'aps-code' }, example.body || t('docs.noExampleBody')),
      )
    }

    function DocSection({ requestId, section, title, children, t }) {
      const copySection = async () => {
        try {
          await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#request-${requestId}-${section}`)
        } catch {}
      }
      return h(
        'div',
        { className: 'aps-doc-section', id: `request-${requestId}-${section}` },
        h(
          'div',
          { className: 'aps-doc-section-head' },
          h('div', { className: 'aps-section-title' }, title),
          h(IconButton, { name: 'link', title: t('docs.copyLink'), onClick: copySection }),
        ),
        children,
      )
    }

    function DocsPage({ requests, flows, runs, selectedId, onSelect, onOpen, onOpenFlow, onOpenRun, t }) {
      const [query, setQuery] = React.useState('')
      const [collapsed, setCollapsed] = React.useState({})
      const [copied, setCopied] = React.useState(false)
      const needle = query.trim().toLowerCase()
      const filtered = needle.length === 0 ? requests : requests.filter((request) => docsText(request).includes(needle))
      const groups = folderGroups(filtered, '')
      React.useEffect(() => {
        const raw = decodeURIComponent(window.location.hash.replace(/^#/, ''))
        if (!raw.startsWith('request-')) return
        let id = raw.slice('request-'.length)
        let section = ''
        for (const suffix of ['headers', 'query', 'body', 'auth', 'assertions', 'cases', 'examples', 'flows', 'runs']) {
          if (id.endsWith(`-${suffix}`)) {
            id = id.slice(0, -(suffix.length + 1))
            section = suffix
            break
          }
        }
        if (requests.some((request) => request.id === id)) {
          onSelect(id)
          window.requestAnimationFrame(() => document.getElementById(section ? `request-${id}-${section}` : `request-${id}`)?.scrollIntoView({ block: 'start' }))
        }
      }, [])
      React.useEffect(() => {
        if (needle.length > 0 && filtered.length > 0 && !filtered.some((request) => request.id === selected?.id)) onSelect(filtered[0].id)
      }, [query])
      React.useEffect(() => {
        document.querySelector('.aps-tree-item.active')?.scrollIntoView({ block: 'nearest' })
      }, [selectedId])
      const copyLink = async () => {
        if (!selected) return
        try {
          await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#request-${selected.id}`)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1500)
        } catch {}
      }
      const selected = requests.find((request) => request.id === selectedId) || requests[0]
      const linkedFlows = selected ? flows.filter((flow) => flow.steps.some((step) => step.requestId === selected.id)) : []
      const linkedRuns = selected ? runs.filter((run) => run.requestId === selected.id).slice(0, 5) : []
      const entries = (list) => h(
        'table',
        { className: 'aps-table' },
        h('thead', null, h('tr', null, h('th', null, 'Name'), h('th', null, 'Value'))),
        h('tbody', null, list.filter((entry) => entry.enabled !== false).map((entry, index) => h('tr', { key: index }, h('td', { className: 'aps-mono' }, entry.key), h('td', { className: 'aps-mono' }, entry.value)))),
      )
      return h(
        'div',
        { className: 'aps-browser' },
        h(
          Browse,
          { storageKey: 'airpost.split.docs', label: t('docs.title'), collapsed: false },
          h(
            'div',
            { className: 'aps-collection' },
            h('div', { className: 'aps-collection-head' }, h('span', { className: 'aps-collection-title' }, t('docs.title')), h(DshTag, { tone: 'neutral' }, needle.length > 0 ? `${filtered.length}/${requests.length}` : String(requests.length))),
            h('div', { className: 'aps-collection-search' }, h(TextInput, { value: query, onChange: setQuery, placeholder: t('docs.search') })),
            h(
              'div',
              { className: 'aps-tree' },
              groups.length === 0
                ? h('div', { className: 'aps-tree-empty' }, t('docs.empty'))
                : groups.map((group) => h(
                    DshDisclosureRow,
                    {
                      key: group.folder || '__root',
                      title: group.folder || t('collection.root'),
                      open: collapsed[group.folder] !== true,
                      expandable: true,
                      expandOnRowClick: true,
                      onToggle: () => setCollapsed((current) => ({ ...current, [group.folder]: current[group.folder] !== true })),
                      icon: h(Icon, { name: 'folder', size: 13 }),
                      headerAccessory: h(DshTag, { tone: 'neutral' }, String(group.items.length)),
                      className: 'aps-folder-row',
                      contentClassName: 'aps-folder-content',
                    },
                    group.items.map((request) => h(
                      DshButton,
                      {
                        key: request.id,
                        variant: 'ghost',
                        size: 'sm',
                        className: `aps-tree-item ${selected?.id === request.id ? 'active' : ''}`,
                        onClick: () => onSelect(request.id),
                        title: `${request.method} ${request.name}`,
                      },
                      h('span', { className: `aps-method ${methodClass(request.method)}` }, request.method),
                      h('span', { className: 'aps-tree-name' }, h(DocsHighlight, { text: request.name, query })),
                    )),
                  )),
            ),
          ),
          h(
            'div',
            { className: 'aps-detail' },
            h('div', { className: 'aps-detail-head' }, h('span', { className: 'aps-detail-title' }, selected ? selected.name : t('docs.title'))),
            h(
              'div',
              { className: 'aps-detail-body' },
              selected
                ? h(
                    'div',
                    { className: 'aps-doc-card', id: `request-${selected.id}` },
                    h('div', { className: 'aps-doc-head' }, h('span', { className: `aps-method ${methodClass(selected.method)}` }, selected.method), h('span', { className: 'aps-doc-name' }, selected.name), h('span', { className: 'aps-tab-spacer' }), h(IconButton, { name: 'copy', title: copied ? t('docs.copied') : t('docs.copyLink'), onClick: copyLink }), h(Button, { size: 'small', tone: 'ghost', icon: 'braces', onClick: () => onOpen(selected.id) }, t('docs.open'))),
                    h('div', { className: 'aps-doc-url' }, h(DocsHighlight, { text: selected.url, query })),
                    h('div', { className: 'aps-doc-description' }, selected.description ? h(DocsHighlight, { text: selected.description, query }) : t('docs.noDescription')),
                    selected.headers.length > 0 ? h(DocSection, { requestId: selected.id, section: 'headers', title: t('request.headers'), t }, entries(selected.headers)) : null,
                    selected.query.length > 0 ? h(DocSection, { requestId: selected.id, section: 'query', title: t('request.params'), t }, entries(selected.query)) : null,
                    selected.body?.type !== 'none' ? h(DocSection, { requestId: selected.id, section: 'body', title: t('docs.body'), t }, h('pre', { className: 'aps-code' }, selected.body.text)) : null,
                    selected.auth?.type !== 'none' ? h(DocSection, { requestId: selected.id, section: 'auth', title: t('docs.auth'), t }, h('span', { className: 'aps-muted' }, selected.auth.type)) : null,
                    selected.tests.length > 0 ? h(DocSection, { requestId: selected.id, section: 'assertions', title: t('request.tests'), t }, selected.tests.map((test, index) => h('div', { className: 'aps-doc-assert', key: index }, `${test.type} · ${test.op || 'contains'} ${formatValue(test.value ?? test.path ?? '')}`))) : null,
                    selected.cases.length > 0 ? h(DocSection, { requestId: selected.id, section: 'cases', title: t('docs.cases'), t }, h('div', { className: 'aps-muted' }, selected.cases.map((entry) => entry.name).join(' · '))) : null,
                    selected.examples.length > 0 ? h(DocSection, { requestId: selected.id, section: 'examples', title: t('docs.examples'), t }, h(DocsExamples, { examples: selected.examples, requestId: selected.id, t })) : null,
                    linkedFlows.length > 0 ? h(DocSection, { requestId: selected.id, section: 'flows', title: t('docs.flows'), t }, linkedFlows.map((flow) => h(Button, { key: flow.id, size: 'small', tone: 'ghost', icon: 'play', onClick: () => onOpenFlow(flow.id) }, flow.name))) : null,
                    linkedRuns.length > 0 ? h(DocSection, { requestId: selected.id, section: 'runs', title: t('docs.runs'), t }, linkedRuns.map((run) => h(Button, { key: run.id, size: 'small', tone: 'ghost', icon: 'history', onClick: () => onOpenRun(run.id) }, `${run.passed ? '✓' : '✕'} ${run.title || run.requestName || run.id}`))) : null,
                    linkedFlows.length === 0 && linkedRuns.length === 0 ? h('div', { className: 'aps-muted', style: { fontSize: 12 } }, t('docs.noLinks')) : null,
                  )
                : h(Empty, { title: t('docs.empty') }),
            ),
          ),
        ),
      )
    }

    /* ------------------------------------------------------------------ */
    /* Main page                                                           */
    /* ------------------------------------------------------------------ */

    function ApiStudioPage(props) {
      const t = typeof props.t === 'function' ? props.t : (key) => key
      const [boot, setBoot] = React.useState(null)
      const [loading, setLoading] = React.useState(true)
      const [fatal, setFatal] = React.useState(null)
      const [view, setView] = React.useState('request')
      const [showCollection, setShowCollection] = React.useState(true)
      const [openRequestTabs, setOpenRequestTabs] = React.useState([])
      const [openFlowTabs, setOpenFlowTabs] = React.useState([])
      const [selectedRequestId, setSelectedRequestId] = React.useState(null)
      const [draft, setDraft] = React.useState(() => newRequestDraft())
      const [dirty, setDirty] = React.useState(false)
      const [selectedFlowId, setSelectedFlowId] = React.useState(null)
      const [flowDraft, setFlowDraft] = React.useState(() => newFlowDraft())
      const [flowDirty, setFlowDirty] = React.useState(false)
      const [response, setResponse] = React.useState(null)
      const [running, setRunning] = React.useState(false)
      const [selectedRunId, setSelectedRunId] = React.useState(null)
      const [runDetail, setRunDetail] = React.useState(null)
      const [selectedReportId, setSelectedReportId] = React.useState(null)
      const [selfTestResult, setSelfTestResult] = React.useState(null)
      const [selfTestRunning, setSelfTestRunning] = React.useState(false)
      const [selectedDocId, setSelectedDocId] = React.useState(null)
      const [reportContent, setReportContent] = React.useState('')
      const [showVars, setShowVars] = React.useState(false)
      const [projectTab, setProjectTab] = React.useState(null)
      const [historyRequestId, setHistoryRequestId] = React.useState(null)
      const [casesOpen, setCasesOpen] = React.useState(false)
      const [relationsOpen, setRelationsOpen] = React.useState(false)
      const [varsOpen, setVarsOpen] = React.useState(false)
      const [runEnvironmentId, setRunEnvironmentId] = React.useState('')
      const [matrixOpen, setMatrixOpen] = React.useState(false)
      const [matrixResult, setMatrixResult] = React.useState(null)
      const [matrixRunning, setMatrixRunning] = React.useState(false)
      const [compareData, setCompareData] = React.useState(null)
      const [batchRunning, setBatchRunning] = React.useState(false)
      const [datasetRunning, setDatasetRunning] = React.useState(false)
      const [saving, setSaving] = React.useState(false)
      const [toast, setToast] = React.useState(null)



      const notify = React.useCallback((message, tone = '') => {
        setToast({ message, tone })
      }, [])

      const canDiscard = (hasChanges) => !hasChanges || window.confirm(t('common.discardChanges'))

      const sessionId = props.sessionId
      const call = React.useCallback((action, payload) => callApi(action, payload, sessionId), [sessionId])

      const refresh = React.useCallback(async () => {
        const data = await call('bootstrap')
        setBoot(data)
        return data
      }, [call])

      React.useEffect(() => {
        let cancelled = false
        const tick = async () => {
          if (cancelled || (typeof document !== 'undefined' && document.visibilityState === 'hidden')) return
          try {
            const data = await call('bootstrap')
            if (!cancelled) setBoot(data)
          } catch {
            // A transient refresh failure leaves the last usable catalog in place.
          }
        }
        const timer = window.setInterval(tick, 5000)
        return () => {
          cancelled = true
          window.clearInterval(timer)
        }
      }, [call])

      React.useEffect(() => {
        if (!boot || dirty || !selectedRequestId) return
        const found = boot.requests.find((request) => request.id === selectedRequestId)
        if (found && found.updatedAt !== draft.updatedAt) setDraft(clone(found))
      }, [boot, selectedRequestId, dirty, draft.updatedAt])

      React.useEffect(() => {
        if (!boot || flowDirty || !selectedFlowId) return
        const found = boot.flows.find((flow) => flow.id === selectedFlowId)
        if (found && found.updatedAt !== flowDraft.updatedAt) setFlowDraft(clone(found))
      }, [boot, selectedFlowId, flowDirty, flowDraft.updatedAt])

      React.useEffect(() => {
        let cancelled = false
        setLoading(true)
        setFatal(null)
        setBoot(null)
        setResponse(null)
        setRunDetail(null)
        setSelectedRunId(null)
        setSelectedReportId(null)
        setReportContent('')
        setOpenRequestTabs([])
        setOpenFlowTabs([])
        setSelectedRequestId(null)
        setSelectedFlowId(null)
        setSelectedDocId(null)
        setDraft(newRequestDraft())
        setFlowDraft(newFlowDraft())
        setView('request')
        setDirty(false)
        setFlowDirty(false)
        ;(async () => {
          try {
            const data = await call('bootstrap')
            if (cancelled) return
            setBoot(data)
            if (data.requests.length > 0) {
              setSelectedRequestId(data.requests[0].id)
              setDraft(clone(data.requests[0]))
              setOpenRequestTabs([data.requests[0].id])
              setView('request')
            } else if (data.flows.length > 0) {
              setSelectedFlowId(data.flows[0].id)
              setFlowDraft(clone(data.flows[0]))
              setOpenFlowTabs([data.flows[0].id])
              setView('flow')
            } else {
              setDraft(newRequestDraft())
            }
            setLoading(false)
          } catch (reason) {
            if (cancelled) return
            setFatal(reason instanceof Error ? reason.message : String(reason))
            setLoading(false)
          }
        })()
        return () => {
          cancelled = true
        }
      }, [call])

      const selectRequest = (id) => {
        const found = boot?.requests?.find((request) => request.id === id)
        if (!found) return
        if (selectedRequestId === id) {
          setView('request')
          return
        }
        if (!canDiscard(dirty)) return
        setSelectedRequestId(id)
        setDraft(clone(found))
        setDirty(false)
        setResponse(null)
        setView('request')
        setOpenRequestTabs((current) => (current.includes(id) ? current : [...current, id]))
      }

      const newRequest = () => {
        if (!canDiscard(dirty)) return
        setSelectedRequestId(null)
        setDraft(newRequestDraft())
        setDirty(false)
        setResponse(null)
        setView('request')
      }

      const selectFlow = (id) => {
        const found = boot?.flows?.find((flow) => flow.id === id)
        if (!found) return
        if (selectedFlowId === id) {
          setView('flow')
          return
        }
        if (!canDiscard(flowDirty)) return
        setSelectedFlowId(id)
        setFlowDraft(clone(found))
        setFlowDirty(false)
        setRunDetail(null)
        setView('flow')
        setOpenFlowTabs((current) => (current.includes(id) ? current : [...current, id]))
      }

      const newFlow = () => {
        if (!canDiscard(flowDirty)) return
        setSelectedFlowId(null)
        setFlowDraft(newFlowDraft())
        setFlowDirty(false)
        setRunDetail(null)
        setView('flow')
      }

      const duplicateRequest = async () => {
        if (!draft.id) return
        try {
          const copy = { ...clone(draft), id: undefined, name: uniqueName(`${draft.name} copy`, (boot.requests || []).map((entry) => entry.name)) }
          const saved = await call('save_request', { request: copy })
          await refresh()
          selectRequest(saved.id)
          notify(t('request.duplicate'))
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        }
      }

      const saveRequest = async () => {
        if (saving) return null
        setSaving(true)
        try {
          const saved = await call('save_request', { request: draft })
          const data = await refresh()
          setSelectedRequestId(saved.id)
          setDraft(clone(data.requests.find((request) => request.id === saved.id) || saved))
          setOpenRequestTabs((current) => (current.includes(saved.id) ? current : [...current, saved.id]))
          setDirty(false)
          notify(t('toast.requestSaved'))
          return saved
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
          return null
        } finally {
          setSaving(false)
        }
      }

      const deleteRequest = async () => {
        if (!draft.id) return
        if (!window.confirm(t('request.deleteConfirm'))) return
        try {
          const deletedId = draft.id
          await call('delete_request', { requestId: deletedId, force: true })
          const data = await refresh()
          const next = data.requests[0]
          setOpenRequestTabs((current) => {
            const nextTabs = current.filter((id) => id !== deletedId)
            if (next && !nextTabs.includes(next.id)) nextTabs.push(next.id)
            return nextTabs
          })
          if (next) {
            setSelectedRequestId(next.id)
            setDraft(clone(next))
          } else {
            setSelectedRequestId(null)
            setDraft(newRequestDraft())
          }
          setResponse(null)
          setDirty(false)
          notify(t('toast.requestDeleted'))
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        }
      }

      const sendRequest = async () => {
        if (running) return
        setRunning(true)
        setResponse(null)
        try {
          const run = await call('run_request', { request: draft, environmentId: runEnvironmentId || undefined })
          setResponse(run)
          setSelectedRunId(run.id)
          setRunDetail(run)
          await refresh()
          notify(t('toast.runDone'))
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        } finally {
          setRunning(false)
        }
      }

      const duplicateFlow = async () => {
        if (!flowDraft.id) return
        try {
          const copy = { ...clone(flowDraft), id: undefined, name: uniqueName(`${flowDraft.name} copy`, (boot.flows || []).map((entry) => entry.name)) }
          const saved = await call('save_flow', { flow: copy })
          await refresh()
          selectFlow(saved.id)
          notify(t('flow.duplicate'))
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        }
      }

      const saveFlow = async () => {
        if (saving) return null
        setSaving(true)
        try {
          const saved = await call('save_flow', { flow: flowDraft })
          const data = await refresh()
          setSelectedFlowId(saved.id)
          setFlowDraft(clone(data.flows.find((flow) => flow.id === saved.id) || saved))
          setOpenFlowTabs((current) => (current.includes(saved.id) ? current : [...current, saved.id]))
          setFlowDirty(false)
          notify(t('toast.flowSaved'))
          return saved
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
          return null
        } finally {
          setSaving(false)
        }
      }

      const runFlow = async () => {
        if (running) return
        setRunning(true)
        setRunDetail(null)
        try {
          const saved = await call('save_flow', { flow: flowDraft })
          const run = await call('run_flow', { flowId: saved.id })
          setSelectedFlowId(saved.id)
          setOpenFlowTabs((current) => (current.includes(saved.id) ? current : [...current, saved.id]))
          setSelectedRunId(run.id)
          setRunDetail(run)
          setFlowDirty(false)
          const data = await refresh()
          setFlowDraft(clone(data.flows.find((flow) => flow.id === saved.id) || saved))
          notify(t('toast.runDone'))
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        } finally {
          setRunning(false)
        }
      }

      const saveResponseExample = () => {
        const result = response?.response
        if (!result) return
        const examples = Array.isArray(draft.examples) ? draft.examples : []
        const example = {
          id: `example-${Date.now().toString(36)}`,
          name: `Example ${examples.length + 1}`,
          status: result.status || 200,
          headers: Object.entries(result.headers || {}).map(([key, value]) => ({ key, value: String(value), enabled: true })),
          body: result.body || '',
          createdAt: new Date().toISOString(),
        }
        setDraft((current) => ({ ...current, examples: [...(current.examples || []), example], mock: { ...(current.mock || {}), exampleId: example.id } }))
        setDirty(true)
        notify(t('mock.exampleSaved'))
      }

      const compareWithPrevious = async () => {
        const current = response
        if (!current?.id) return
        const previous = (boot.runs || []).filter((entry) => entry.requestId === current.requestId && entry.id !== current.id).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0]
        if (!previous) { notify(t('run.noPrevious')); return }
        try {
          const detail = await call('get_run', { runId: previous.id })
          setCompareData({ previous: detail, current })
        } catch (error) {
          notify(error?.message || String(error), 'error')
        }
      }

      const runCase = async (cases, caseValue) => {
        if (!caseValue) return
        setDraft((current) => ({ ...current, cases }))
        setDirty(true)
        try {
          const run = await call('run_case', { request: { ...draft, cases }, case: caseValue, environmentId: runEnvironmentId || undefined })
          setResponse(run)
          setSelectedRunId(run.id)
          setRunDetail(run)
          setView('request')
          await refresh()
          notify(t('toast.runDone'))
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        }
      }

      const runFlowDataset = async () => {
        if (running || datasetRunning) return
        if (!Array.isArray(flowDraft.dataset) || flowDraft.dataset.length === 0) return
        setDatasetRunning(true)
        try {
          const saved = await call('save_flow', { flow: flowDraft })
          const data = await call('run_flow_dataset', { flowId: saved.id })
          setSelectedFlowId(saved.id)
          setOpenFlowTabs((current) => (current.includes(saved.id) ? current : [...current, saved.id]))
          setFlowDirty(false)
          await refresh()
          setView('run')
          if (data.runs?.[0]?.id) await openRun(data.runs[0].id)
          notify(t('run.allDone', { passed: data.passed, count: data.count }))
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        } finally {
          setDatasetRunning(false)
        }
      }

      const runSelfTest = async () => {
        if (selfTestRunning) return
        setSelfTestRunning(true)
        try {
          const result = await call('self_test')
          setSelfTestResult(result)
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        } finally {
          setSelfTestRunning(false)
        }
      }

      const runMatrix = async (options) => {
        setMatrixRunning(true)
        try {
          const data = await call('run_all', options)
          setMatrixResult(data)
          await refresh()
          notify(t('run.matrixDone'))
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        } finally {
          setMatrixRunning(false)
        }
      }

      const runAll = async () => {
        if (batchRunning) return
        setBatchRunning(true)
        try {
          const data = await call('run_all')
          await refresh()
          setView('run')
          if (data.runs?.[0]?.id) await openRun(data.runs[0].id)
          notify(t('run.allDone', { passed: data.passed, count: data.count }))
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        } finally {
          setBatchRunning(false)
        }
      }

      const deleteFlow = async () => {
        if (!flowDraft.id) return
        if (!window.confirm(t('flow.deleteConfirm'))) return
        try {
          const deletedId = flowDraft.id
          await call('delete_flow', { flowId: deletedId })
          const data = await refresh()
          const next = data.flows[0]
          setOpenFlowTabs((current) => {
            const nextTabs = current.filter((id) => id !== deletedId)
            if (next && !nextTabs.includes(next.id)) nextTabs.push(next.id)
            return nextTabs
          })
          if (next) {
            setSelectedFlowId(next.id)
            setFlowDraft(clone(next))
          } else {
            setSelectedFlowId(null)
            setFlowDraft(newFlowDraft())
          }
          setFlowDirty(false)
          setRunDetail(null)
          notify(t('toast.flowDeleted'))
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        }
      }

      const closeRequestTab = (id) => {
        if (id === selectedRequestId && !canDiscard(dirty)) return
        const index = openRequestTabs.indexOf(id)
        const next = openRequestTabs.filter((value) => value !== id)
        setOpenRequestTabs(next)
        if (selectedRequestId !== id) return
        const fallbackId = next[Math.max(0, Math.min(index, next.length - 1))]
        const fallback = fallbackId ? boot?.requests?.find((request) => request.id === fallbackId) : undefined
        if (fallback) {
          setSelectedRequestId(fallback.id)
          setDraft(clone(fallback))
          setDirty(false)
          setResponse(null)
        } else {
          setSelectedRequestId(null)
          setDraft(newRequestDraft())
          setDirty(false)
          setResponse(null)
        }
      }

      const closeFlowTab = (id) => {
        if (id === selectedFlowId && !canDiscard(flowDirty)) return
        const index = openFlowTabs.indexOf(id)
        const next = openFlowTabs.filter((value) => value !== id)
        setOpenFlowTabs(next)
        if (selectedFlowId !== id) return
        const fallbackId = next[Math.max(0, Math.min(index, next.length - 1))]
        const fallback = fallbackId ? boot?.flows?.find((flow) => flow.id === fallbackId) : undefined
        if (fallback) {
          setSelectedFlowId(fallback.id)
          setFlowDraft(clone(fallback))
          setFlowDirty(false)
          setRunDetail(null)
        } else {
          setSelectedFlowId(null)
          setFlowDraft(newFlowDraft())
          setFlowDirty(false)
          setRunDetail(null)
        }
      }

      const openRun = async (id) => {
        setSelectedRunId(id)
        setView('run')
        try {
          const run = await call('get_run', { runId: id })
          setRunDetail(run)
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        }
      }

      const openReport = async (id) => {
        try {
          const data = await call('read_report', { reportId: id })
          setSelectedReportId(id)
          setReportContent(data.content)
          setView('report')
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        }
      }

      const deleteReport = async () => {
        if (!selectedReportId || !window.confirm(t('report.deleteConfirm'))) return
        try {
          await call('delete_report', { reportId: selectedReportId })
          await refresh()
          setSelectedReportId(null)
          setReportContent('')
          notify(t('toast.reportDeleted'))
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        }
      }

      const saveVariables = async (variables) => {
        try {
          await call('save_variables', { variables })
          await refresh()
          setShowVars(false)
          notify(t('toast.variablesSaved'))
        } catch (reason) {
          notify(reason instanceof Error ? reason.message : String(reason), 'bad')
        }
      }

      React.useEffect(() => {
        if (!dirty && !flowDirty) return
        const warn = (event) => {
          event.preventDefault()
          event.returnValue = ''
        }
        window.addEventListener('beforeunload', warn)
        return () => window.removeEventListener('beforeunload', warn)
      }, [dirty, flowDirty])

      const handleShortcut = (event) => {
        if (event.isComposing || event.repeat) return
        if (!(event.metaKey || event.ctrlKey) || event.altKey) return
        const key = event.key.toLowerCase()
        if (key === 's' && !event.shiftKey) {
          if (view !== 'request' && view !== 'flow') return
          event.preventDefault()
          event.stopPropagation()
          if (view === 'request') void saveRequest()
          else void saveFlow()
          return
        }
        if (event.key === 'Enter' && !event.shiftKey) {
          if (view !== 'request' && view !== 'flow') return
          event.preventDefault()
          event.stopPropagation()
          if (view === 'request') void sendRequest()
          else void runFlow()
        }
      }

      const currentReport = (boot?.reports || []).find((report) => report.id === selectedReportId)

      const switchView = (key) => {
        if (key === view) return
        setView(key)
        if (key === 'flow' && runDetail && runDetail.kind !== 'flow') setRunDetail(null)
        if (key === 'run' && (!selectedRunId || !runDetail) && (boot?.runs || []).length > 0) {
          openRun(boot.runs[0].id)
        } else if (key === 'report' && (!selectedReportId || !reportContent) && (boot?.reports || []).length > 0) {
          openReport(boot.reports[0].id)
        } else if (key === 'request' && openRequestTabs.length === 0 && (boot?.requests || []).length > 0) {
          selectRequest(boot.requests[0].id)
        } else if (key === 'docs' && !selectedDocId && (boot?.requests || []).length > 0) {
          setSelectedDocId(boot.requests[0].id)
        }
      }

      const navTabs = [
        ['request', t('nav.requests')],
        ['flow', t('nav.flows')],
        ['run', t('nav.runs')],
        ['report', t('nav.reports')],
        ['docs', t('nav.docs')],
      ]

      if (loading) {
        return h('div', { className: 'aps-root aps-right-root' }, h('style', null, CSS), h(Loading, { label: t('common.loading') }))
      }
      if (fatal) {
        return h('div', { className: 'aps-root aps-right-root' }, h('style', null, CSS), h('div', { style: { padding: 14 } }, h(ErrorBlock, { title: t('common.error'), error: fatal }), h(Button, { onClick: () => window.location.reload() }, t('common.refresh'))))
      }

      return h(
        'div',
        { className: 'aps-root aps-right-root', onKeyDownCapture: handleShortcut },
        h('style', null, CSS),
        h(
          'div',
          { className: 'aps-right-main' },
          h(
            'div',
            { className: 'aps-mode-bar' },
            h(DshSegmentedTabs, {
              className: 'aps-mode-tabs',
              label: t('panel.title'),
              items: navTabs.map(([key, label]) => ({ value: key, label })),
              value: view,
              onChange: switchView,
            }),
            h(
              'div',
              { className: 'aps-mode-actions' },
              h(Button, { size: 'small', tone: 'ghost', onClick: () => setProjectTab('env') }, t('project.env')),
              h(Button, { size: 'small', tone: 'ghost', onClick: () => setProjectTab('transfer') }, t('project.transfer')),
            ),
          ),
          h(
            'div',
            { className: 'aps-right-body' },
            view === 'request'
              ? h(
                  'div',
                  { className: 'aps-browser' },
                  h(Browse, {
                    storageKey: `airpost.split.collection.${sessionId || 'local'}`,
                    label: t('collection.title'),
                    collapsed: !showCollection,
                  },
                  showCollection
                    ? h(CollectionPane, {
                        key: 'request-collection',
                        kind: 'request',
                        items: boot.requests,
                        activeId: selectedRequestId,
                        onSelect: selectRequest,
                        onNew: newRequest,
                        t,
                      })
                    : null,
                  h(
                    'div',
                    { className: 'aps-detail' },
                    h(OpenTabs, {
                      kind: 'request',
                      ids: openRequestTabs,
                      items: boot.requests,
                      activeId: selectedRequestId,
                      onSelect: selectRequest,
                      onClose: closeRequestTab,
                      onNew: newRequest,
                      onToggleCollection: () => setShowCollection((current) => !current),
                      t,
                    }),
                    h(
                      'div',
                      { className: 'aps-right-request' },
                      h(ResizableRows, {
                        storageKey: `airpost.vsplit.request.${sessionId || 'local'}`,
                        label: t('request.name'),
                        initial: 430,
                        min: 160,
                        bottomMin: 190,
                        top: h(RequestEditor, {
                          draft,
                          setDraft: (value) => {
                            setDraft(value)
                            setDirty(true)
                          },
                          dirty,
                          onSave: saveRequest,
                          onDelete: deleteRequest,
                          onHistory: () => draft.id && setHistoryRequestId(draft.id),
                          onCases: () => draft.id && setCasesOpen(true),
                          onDuplicate: duplicateRequest,
                          onRelations: () => draft.id && setRelationsOpen(true),
                          onVars: () => draft.id && setVarsOpen(true),
                          onSend: sendRequest,
                          running,
                          saving,
                          response,
                          mockBase: boot.mockBase,
                          environments: boot.environments,
                          activeEnvironmentId: boot.activeEnvironmentId,
                          runEnvironmentId,
                          onRunEnvironment: setRunEnvironmentId,
                          sessionId,
                          t,
                        }),
                        bottom: h(ResponsePanel, {
                          run: response,
                          t,
                          onSaveExample: saveResponseExample,
                          onCompare: compareWithPrevious,
                          onApplyCookies: (cookies) => {
                            setDraft((current) => {
                              const next = [...(current.cookies || [])]
                              for (const cookie of cookies) {
                                const index = next.findIndex((entry) => entry.key === cookie.name)
                                if (index >= 0) next[index] = { ...next[index], value: cookie.value, enabled: true }
                                else next.push({ key: cookie.name, value: cookie.value, enabled: true })
                              }
                              return { ...current, cookies: next }
                            })
                            setDirty(true)
                            notify(t('toast.cookiesApplied'))
                          },
                        }),
                      }),
                    ),
                  ),
                ),
              )
              : view === 'flow'
                ? h(
                    'div',
                    { className: 'aps-browser' },
                    h(Browse, {
                      storageKey: `airpost.split.collection.${sessionId || 'local'}`,
                      label: t('collection.title'),
                      collapsed: !showCollection,
                    },
                    showCollection
                      ? h(CollectionPane, {
                          key: 'flow-collection',
                          kind: 'flow',
                          items: boot.flows,
                          activeId: selectedFlowId,
                          onSelect: selectFlow,
                          onNew: newFlow,
                          t,
                        })
                      : null,
                    h(
                      'div',
                      { className: 'aps-detail' },
                      h(OpenTabs, {
                        kind: 'flow',
                        ids: openFlowTabs,
                        items: boot.flows,
                        activeId: selectedFlowId,
                        onSelect: selectFlow,
                        onClose: closeFlowTab,
                        onNew: newFlow,
                        onToggleCollection: () => setShowCollection((current) => !current),
                        t,
                      }),
                      h(
                        'div',
                        { className: 'aps-right-workbench' },
                        h(ResizableRows, {
                          storageKey: `airpost.vsplit.flow.${sessionId || 'local'}`,
                          label: t('flow.run'),
                          initial: 430,
                          min: 160,
                          bottomMin: 190,
                          top: h(FlowEditor, {
                            draft: flowDraft,
                            setDraft: (value) => {
                              setFlowDraft(value)
                              setFlowDirty(true)
                            },
                            dirty: flowDirty,
                            requests: boot.requests,
                            onSave: saveFlow,
                            onRun: runFlow,
                            onRunDataset: runFlowDataset,
                            onDelete: deleteFlow,
                            onDuplicate: duplicateFlow,
                            running,
                            datasetRunning,
                            t,
                          }),
                          bottom: h(FlowResultPane, { run: runDetail, t }),
                        }),
                      ),
                    ),
                  ),
                )
                : view === 'run'
                  ? h(
                      'div',
                      { className: 'aps-browser' },
                      h(Browse, {
                        storageKey: `airpost.split.runs.${sessionId || 'local'}`,
                        label: t('nav.runs'),
                        collapsed: false,
                      },
                      h(RecordListPane, { kind: 'run', items: boot.runs, activeId: selectedRunId, onSelect: openRun, t }),
                      h(
                        'div',
                        { className: 'aps-detail' },
                        h(
                          'div',
                          { className: 'aps-detail-head' },
                          h('span', { className: 'aps-detail-title' }, t('nav.runs')),
                          h('span', { className: 'aps-tab-spacer' }),
                          h(Button, { size: 'small', tone: 'ghost', icon: 'list', onClick: () => setMatrixOpen(true), disabled: batchRunning || matrixRunning }, t('run.matrix')),
                          h(Button, { size: 'small', tone: 'ghost', icon: 'play', onClick: runAll, disabled: batchRunning }, batchRunning ? t('common.running') : t('run.all')),
                        ),
                        h('div', { className: 'aps-detail-body' }, h(RunDetail, {
                          run: runDetail,
                          t,
                          history: (boot.runs || []).filter((entry) => runDetail && (entry.requestId === runDetail.requestId || (runDetail.flowId && entry.flowId === runDetail.flowId))),
                        })),
                      ),
                      ),
                    )
                  : view === 'report'
                    ? h(
                        'div',
                        { className: 'aps-browser' },
                        h(Browse, {
                          storageKey: `airpost.split.reports.${sessionId || 'local'}`,
                          label: t('nav.reports'),
                          collapsed: false,
                        },
                        h(RecordListPane, { kind: 'report', items: boot.reports, activeId: selectedReportId, onSelect: openReport, t }),
                        h(
                          'div',
                          { className: 'aps-detail' },
                          h('div', { className: 'aps-detail-head' }, h('span', { className: 'aps-detail-title' }, t('nav.reports')), h('span', { className: 'aps-tab-spacer' }), h(Button, { size: 'small', tone: 'ghost', icon: 'play', onClick: runSelfTest, disabled: selfTestRunning }, selfTestRunning ? t('common.running') : t('run.selfTest'))),
                          h('div', { className: 'aps-detail-body' }, h(ReportView, { report: currentReport, content: reportContent, onDelete: deleteReport, t })),
                        ),
                        ),
                      )
                      : view === 'docs'
                        ? h(DocsPage, {
                            requests: boot.requests,
                            flows: boot.flows,
                            runs: boot.runs,
                            selectedId: selectedDocId,
                            onSelect: setSelectedDocId,
                            onOpen: (id) => { setSelectedDocId(id); selectRequest(id) },
                            onOpenFlow: (id) => selectFlow(id),
                            onOpenRun: (id) => openRun(id),
                            t,
                          })
                        : null,
          ),
        ),
        showVars ? h(VariablesModal, { variables: boot.workspace, onSave: saveVariables, onClose: () => setShowVars(false), t }) : null,
        matrixOpen
          ? h(MatrixModal, {
              requests: boot.requests,
              environments: boot.environments,
              onClose: () => setMatrixOpen(false),
              onRun: runMatrix,
              result: matrixResult,
              running: matrixRunning,
              onOpenRun: (id) => { setMatrixOpen(false); openRun(id) },
              t,
            })
          : null,
        varsOpen
          ? h(VariableInspector, {
              draft,
              workspace: boot.workspace,
              environments: boot.environments,
              activeEnvironmentId: boot.activeEnvironmentId,
              onClose: () => setVarsOpen(false),
              t,
            })
          : null,
        selfTestResult
          ? h(SelfTestModal, { result: selfTestResult, onClose: () => setSelfTestResult(null), t })
          : null,
        compareData
          ? h(ResponseDiffModal, { previous: compareData.previous, current: compareData.current, onClose: () => setCompareData(null), t })
          : null,
        relationsOpen
          ? h(RelationsModal, {
              request: draft,
              flows: boot.flows,
              runs: boot.runs,
              call,
              onClose: () => setRelationsOpen(false),
              onOpenCases: () => setCasesOpen(true),
              onOpenFlow: selectFlow,
              onOpenRun: openRun,
              onOpenHistory: () => draft.id && setHistoryRequestId(draft.id),
              t,
            })
          : null,
        casesOpen
          ? h(CasesModal, {
              request: draft,
              onChange: (cases) => { setDraft((current) => ({ ...current, cases })); setDirty(true) },
              onRun: runCase,
              onClose: () => setCasesOpen(false),
              t,
            })
          : null,
        historyRequestId
          ? h(HistoryModal, {
              requestId: historyRequestId,
              call,
              onClose: () => setHistoryRequestId(null),
              onRestored: async () => {
                const data = await refresh()
                const found = data.requests.find((request) => request.id === historyRequestId)
                if (found) {
                  setSelectedRequestId(found.id)
                  setDraft(clone(found))
                  setDirty(false)
                }
              },
              notify,
              t,
            })
          : null,
        projectTab
          ? h(ProjectModal, {
              boot,
              call,
              initialTab: projectTab,
              selectedRequestId,
              onClose: () => setProjectTab(null),
              onRefresh: refresh,
              onImported: (requests) => {
                const first = Array.isArray(requests) ? requests[0] : undefined
                if (!first) return
                setSelectedRequestId(first.id)
                setDraft(clone(first))
                setDirty(false)
                setResponse(null)
                setView('request')
                setOpenRequestTabs((current) => (current.includes(first.id) ? current : [...current, first.id]))
              },
              notify,
              t,
            })
          : null,
        toast ? h(DshToast, { text: toast.message, tone: toast.tone === 'bad' ? 'error' : 'success', holdMs: 4200, onDone: () => setToast(null) }) : null,
      )
    }

    /* ------------------------------------------------------------------ */
    /* Registration                                                        */
    /* ------------------------------------------------------------------ */

    class AirPostBoundary extends React.Component {
      constructor(props) {
        super(props)
        this.state = { error: null }
      }

      static getDerivedStateFromError(error) {
        return { error }
      }

      componentDidCatch(error, info) {
        console.error('AirPost render error', error, info)
      }

      render() {
        if (this.state.error) {
          return h(
            'div',
            { style: { padding: 16, color: 'var(--dsw-alias-state-error-primary)', fontFamily: 'inherit', fontSize: 12, lineHeight: 1.6 } },
            h('div', { style: { fontWeight: 700, marginBottom: 6 } }, 'AirPost render error'),
            h('pre', { style: { whiteSpace: 'pre-wrap', margin: 0 } }, String(this.state.error && this.state.error.message ? this.state.error.message : this.state.error)),
          )
        }
        return this.props.children
      }
    }

    function AirPostBody(props) {
      return h(AirPostBoundary, null, h(ApiStudioPage, props))
    }

    function LegacyMainRedirect({ redirect }) {
      React.useEffect(() => {
        redirect()
      }, [redirect])
      return null
    }

    function StudioTabTitle({ t }) {
      return h('span', null, typeof t === 'function' ? t('panel.title') : '接口测试')
    }

    return {
      inject: ['slots', 'locale', 'layout', 'sidebarRight', 'sidebarRightTabs'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { en, zh }), 'api-studio: dictionaries')
        const t = ctx.locale.bind(NS)

        ctx.effect(() => {
          const dispose = ctx.sidebarRightTabs.register({
            id: 'api-studio',
            kind: 'api-studio',
            keepMounted: true,
            title: () => t('panel.title'),
            guide: [
              {
                id: 'open',
                order: 30,
                title: () => t('panel.title'),
                description: () => t('panel.subtitle'),
                icon: StudioIcon,
              },
            ],
          })
          return dispose
        }, 'api-studio: right tab type')

        ctx.slots.inject('sidebar.right.pane.tab', () =>
          ctx.slots.register(
            {
              name: 'sidebar.right.pane.tab',
              key: 'api-studio',
              locale: NS,
            },
            AirPostBody,
          ),
        )

        // Migration: an earlier build opened AirPost in the center panel.
        // If that stale selection is still active, send the center back to the
        // AI conversation; this main cell is otherwise never selected.
        ctx.slots.inject('main', () =>
          ctx.slots.register(
            {
              name: 'main',
              key: 'api-studio',
              inject: () => ({ redirect: () => { try { ctx.layout.selectPanel('conversation') } catch (error) { console.warn('api-studio: could not restore the conversation panel', error) } } }),
            },
            LegacyMainRedirect,
          ),
        )

        ctx.slots.inject('sidebar.right.pane.tab.title', () =>
          ctx.slots.register(
            {
              name: 'sidebar.right.pane.tab.title',
              key: 'api-studio',
              locale: NS,
            },
            StudioTabTitle,
          ),
        )
      },
    }
  },
})
