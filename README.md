# AirPost

AirPost — a DSH right-sidebar plugin for Postman-style API definition, request testing, multi-step business-flow testing, and run reports. AI authoring and analysis are provided by the DSH conversation, not by an in-panel assistant.

## Package identity

- DSH bundle / npm package: `dsh-air-post`
- Source folder: `/opt/Workspace/dsh-air-post`
- Product / UI name: **AirPost**
- Host route and Agent tool keep their stable IDs: `/api-studio` and `api_studio`
- Project data stays under `.api-studio/`

## Where everything lives

All artifacts are plain JSON/Markdown under the calling Session's effective
working directory. The Agent tool uses its Agent's Session; the right-sidebar
tab passes its `sessionId`. Sessions in the same directory share one
`.api-studio`; switching to a Session in another project opens that project's
own store. `API_STUDIO_ROOT` pins a single global override when needed.


```
.api-studio/
  workspace.json          global variables ({{baseUrl}}, tokens, ...)
  requests/<id>.json      request definitions, auth, body, assertions
  flows/<id>.json         ordered steps, overrides, variable extraction
  runs/<id>.json          full run records
  runs/index.json         recent-run summaries
  reports/<id>.md         AI or rule-based analysis reports
  reports/index.json      report metadata
```

Nothing is stored in the DSH profile. Deleting a definition deletes only its file.
The right-sidebar layout is itself per Session: switching projects switches the
tab layout, and returning to the original Session restores its tab and project
store.

## UI

Click **AirPost** in the conversation header, or open the right sidebar and pick
**AirPost** from its guide. The tool lives in the right sidebar tab, so the
center column stays on the AI conversation and you can keep typing natural
language while adjusting a request manually. The catalog refreshes every five
seconds, so requests, flows, runs, and reports created from the chat appear in
the right pane without a manual reload.

The duplicate title/brand header is gone, while the DSH native tab strip keeps
its default height. The five AirPost function tabs form a 32px bar with 3px top and bottom padding
at the top of the content. A compact text-only Variables action stays on the right; the catalog
refreshes automatically.

Request and flow document tabs use the DSH tab strip visual language: a fixed
32px bar (also when every tab is closed), 28px active pill with 2px vertical
breathing room and a close control,
transparent inactive tabs, and a plus action.

The left list header on every list page uses the same fixed 32px height as the
document tab bar.

The collection/editor, runs/detail, and reports/detail pages use a draggable
vertical splitter. Drag it to resize the left pane; double-click resets it, and
arrow keys move it when focused. The width is remembered per Session.

Controls are DSH primitives (`Button`, `Input`, `Checkbox`, `SegmentedTabs`,
`Menu`, `Modal`, `Toast`, `Tooltip`, `Tag`, `DisclosureRow`, `JsonTree`,
`StateDot`). Typography follows the DSH Settings panel: 13px labels and values,
34px fields with 0.5px borders and layer-3 surfaces. Icon-only buttons match the
left workspace list's 16px icon button (transparent, tertiary color, primary on
hover). JSON, request bodies, and assertion scripts use Monaco Editor (loaded on
demand from jsDelivr); if the CDN cannot load, the same component falls back to
a DSH-token textarea.

- **Requests**: a folder-grouped collection tree, open-document tabs, method +
  URL + params/headers/body/auth tabs; collection, timeout and redirect
  controls; a structured assertion editor (status, JSON path, body, header,
  latency, or a sandboxed JS script); Send/Save/Delete; response
  body/headers/assertions/schema tabs.
- **Flows**: folder-grouped flow collection, open tabs, add steps from saved
  requests, reorder them, extract variables (`body` path, `header`, `status`,
  or `regex`), override a step with JSON, choose stop/continue on failure, then
  Run flow.
- **Runs**: inspect every request/flow run, per-step status, assertion results,
  extracted variables, and response excerpts.
- **Reports**: read and delete AI or rule-based Markdown reports. The AirPost
  panel has no AI assistant page; ask the conversation to create requests,
  flows, or reports and the agent calls the AirPost Host actions.
- **Variables**: edit workspace variables used as `{{name}}` everywhere.

The demo collection (JSONPlaceholder) is seeded on first open. It exercises a
real extract-userId-then-refetch business flow.

## Variable and assertion model

Templates use `{{name}}`. Built-ins are `{{runId}}`, `{{uuid}}`,
`{{timestamp}}`, and `{{now}}`. Flow variables and extracted step values
override workspace variables for the rest of the run. Extracted values are
stored as strings, so numeric script comparisons should use
`Number(vars.userId)` or `==` rather than strict `===`.

Assertions:

```json
[
  { "type": "status", "op": "eq", "value": 200 },
  { "type": "json", "path": "data.items[0].id", "op": "exists" },
  { "type": "json", "path": "code", "op": "eq", "value": 0 },
  { "type": "body", "op": "contains", "value": "ok" },
  { "type": "header", "header": "content-type", "op": "contains", "value": "json" },
  { "type": "latency", "op": "lt", "value": 2000 },
  { "type": "script", "code": "return response.status === 200 && json.ok === true" }
]
```

Operators: `eq`, `ne`, `exists`, `notexists`, `truthy`, `falsy`, `contains`,
`notcontains`, `regex`, `gt`, `gte`, `lt`, `lte`, `in`, `type`, `length`.
Scripts run in a `node:vm` context with a 1-second timeout and read
`response`, `status`, `headers`, `body`, `json`, and `vars`.

## Apifox core features

AirPost now covers the local-first core of Apifox's API workflow:

- **Run environment**: pick an environment for a single request/case without changing the active environment; global variables are still merged.
- **Multi-environment matrix**: `run_all` accepts `environmentIds`, `requestIds`, and `includeFlows` to run a request across environments and return a per-environment matrix; the Run page exposes the same matrix in a modal with grouped/table views, difference filter, TSV copy/download, a diff-only report, and Markdown/HTML matrix reports with pass bars; standalone examples include filtering.
- **Environments**: named environments, active environment selection, per-environment
  variables, global variables, and global request headers/query parameters. Variables
  resolve from request/flow scope into the active environment and global scope.
- **Dynamic values**: `{{$timestamp}}`, `{{$isoTimestamp}}`, `{{$uuid}}`, `{{$randomInt}}`,
  `{{$randomInt(1,100)}}`, `{{$randomString}}`, `{{$randomEmail}}`, `{{$randomName}}`,
  `{{$randomBoolean}}`, and date/city/country/phone helpers.
- **Import**: auto-detect source, cURL, OpenAPI/Swagger JSON or YAML, Postman Collection JSON, HAR JSON, Insomnia, YApi, AirPost workspace JSON, Postman/Insomnia environment JSON, with multipart file mapping, merge/replace strategy, and an import preview.
- **Export**: OpenAPI 3 JSON (paths, params, requestBody, examples), Postman Collection JSON (tests + wrapped custom scripts), Postman/Insomnia Environment JSON, Insomnia, YApi, AirPost workspace JSON, cURL, Markdown API docs (including examples), standalone HTML API docs.
- **Batch run**: run every request and flow from the Runs header.
- **Data-driven flow**: JSON dataset rows run the same flow once per row with row keys as variables.
- **Flow control**: per-step run condition (`variables.userId != null`) and delay in ms.
- **Mock**: per-request mock status/headers/body/delay, served at `/api-studio/mock/<request-id>` with CORS; path aliases (`:id`, `*`) are available at `/api-studio/mock/path?path=...`; captured path params render as `{{id}}` in mock headers/body; query/header conditions select between path mocks. Save a real response as an example; when the mock body is empty, the first example supplies status, headers, and body. Smart mock randomizes JSON values by field name and type.
- **Pre/post scripts**: JavaScript hooks with a small `pm` API (`pm.variables`, `pm.environment`, `pm.test`, `pm.response`). Pre scripts can set variables used by the request; post scripts can inspect the response, set variables, and add assertions.
- **Project settings**: one modal for environments, global variables, import, and export.
- **Response viewer**: pretty/raw body, JSONPath probe, copy/download body, copy as cURL, fetch/axios/Python/Go snippets with variable resolution and file download, structured header table, previous-run body/header diff with unified and side-by-side views, line numbers, diff navigation, character-level highlights, only-changed filter, persisted fold preference for unchanged blocks, copyable diff, and lower-layer override hints.
- **Run trend**: the run detail shows recent durations for the same request/flow with pass/fail colors, range filter (12/24/all, 7/30/all days), and average latency.
- **Variable inspector**: request header resolves placeholders from request/environment/global layers, flags missing names, and marks lower-layer overrides.
- **Relations hub**: request header exposes a clickable, zoomable, draggable relation graph with radial/tree layouts plus linked cases, flows, recent runs, and history versions.
- **Docs view**: dedicated API documentation tab with full-text search and highlighting, folder directory, request/body/auth/assertions/cases, switchable/copyable response examples with headers, section links, and searchable, bilingual multi-example standalone HTML (light/dark), linked flows, recent runs, folder collapse, copyable per-request and per-section anchors, and a jump back to the request editor.
- **Form bodies**: structured key/value fields encoded as application/x-www-form-urlencoded (raw text remains a fallback).
- **Duplicate request/flow/case/environment**: copy the current item with unique naming, including nested steps/cases/examples/mock/scripts/variables.
- **Request history**: automatic revisions on save, restore from the request header history button.
- **Request cases**: per-request variants with JSON overrides, runnable from the request header cases modal.
- **Auth**: Bearer, Basic, API Key, Digest, OAuth 1.0 HMAC-SHA1/PLAINTEXT, Hawk, AWS Signature v4, and OAuth 2.0 client credentials (token fetch + cache).
- **Cookies**: request cookie list, Cookie header assembly, response `Set-Cookie` parsing, and one-click apply response cookies to the request.

OpenAPI import accepts both JSON and YAML.
Cloud/team collaboration, SSO, CI runners, cloud mock, WebSocket/SSE/gRPC/SOAP,
and database steps remain outside the local AirPost scope.

## AI via the conversation

There is no AI page inside the right sidebar. The conversation agent uses the
same `api_studio` tool to call these Host AI actions. They use the profile's
default model (`ctx.llm`) and appear as:

- **author**: natural language -> saved request(s) and/or flow
- **analyst**: run -> Markdown report saved under `reports/`

If no default model is configured, the UI says so and every manual operation
still works; analysis falls back to a deterministic report. AI calls can be
overridden with `API_STUDIO_AI_PROVIDER` and `API_STUDIO_AI_MODEL`.

## Agent tool

The plugin registers the `api_studio` tool so the chat agent can perform the
same operations:

```
bootstrap, get_request, get_flow, save_request, save_flow,
delete_request, delete_flow, run_request, run_flow,
list_runs, get_run, save_variables, save_environments, list_history,
restore_history, import_data, export_data, run_all, run_case, run_flow_dataset,
ai_create, ai_analyze, list_reports, read_report, delete_report, self_test, seed_demo
```

`ai_create` takes `{ prompt, kind }`; `ai_analyze` takes `{ runId, prompt? }`.
`import_data` takes `{ source, text }`; `export_data` takes `{ target, requestId? }`;
`run_all` takes no extra parameters.
The tool and the sidebar route call the same Host operation layer.

## Host route

`POST /api-studio` with `{ "action": "...", ... }` and JSON content type.
Requests are admitted through the same same-origin browser-session check as
`/api`; only `http`/`https` targets are allowed. Response bodies are capped at
2 MB (stored runs at 600 KB).
