# Apifox docs study → AirPost feature map

Research snapshot: `https://docs.apifox.com/sitemap.xml` contained **556** unique
documentation pages. All pages were fetched successfully; extracted text is used
only as product research. AirPost is an independent local-first implementation.

## What was copied into AirPost

| Apifox area | AirPost implementation |
| --- | --- |
| API project / folders | `.api-studio/requests/*.json`, folder groups, search |
| API request builder | method, URL, query, headers, JSON/text/form/multipart body (structured fields, file upload, 5MB limit, multipart exports), timeout, redirects |
| Auth | Bearer, Basic, API Key (header/query), Digest, OAuth 1.0 HMAC-SHA1/PLAINTEXT, Hawk, AWS Signature v4, OAuth 2.0 client credentials |
| Cookies | request cookies assembled into Cookie header; response Set-Cookie parsed and reusable |
| Environment variables | named environments, active environment, global/environment variable merge |
| Global parameters | global headers and query parameters in workspace settings |
| Dynamic values | timestamp, UUID, random int/string/email/name/boolean/date/city/phone |
| Assertions | status, JSONPath, body, header, latency, JavaScript, JSON Schema |
| Variable extraction | body/header/status/regex, passed between flow steps |
| Test scenarios | multi-step flows, per-step overrides, stop/continue on failure, run condition, delay |
| Data-driven | flow `dataset` JSON array; one run per row, row keys become variables |
| Runs and reports | run history, assertions, Markdown reports, pretty/raw body, JSONPath probe, header table, previous-run body/header diff (unified/side-by-side, line numbers, navigation, character highlights, only-changed filter, persisted fold preference for unchanged blocks, copy diff), recent-run trend with count/date filters; assertion pass-rate meter |
| Batch testing | `run_all` across all requests and flows |
| Mock | per-request mock at `/api-studio/mock/<id>` and path-level aliases at `/api-studio/mock/path` with `{{param}}` injection and query/header conditions; saved response examples used as fallback; smart mock generates from JSON Schema or randomizes example/request values; selected example priority |
| Scripts | pre/post JavaScript hooks with `pm.variables`, `pm.environment`, `pm.response`, and `pm.test` |
| Import | auto-detect, cURL, OpenAPI/Swagger, Postman, HAR, Insomnia, YApi, workspace/env JSON with multipart file mapping |
| Export | OpenAPI 3 JSON, Postman Collection JSON with tests/custom-script wrapper, Postman/Insomnia Environment JSON, Markdown/HTML docs with examples, Insomnia, YApi, workspace JSON, cURL |
| Duplicate request/flow/case/env | unique naming + nested configuration |
| Request cases | per-request variants with JSON overrides, runnable independently |
| Variable inspector | resolves request/environment/global variables, flags missing names/overrides |
| Relations hub | clickable/zoomable/draggable graph (radial/tree) plus links to cases, flows, recent runs, and history |
| Request history | automatic revisions on save; list and restore from the request header |
| API docs | dedicated Docs tab with full-text search/highlighting, directory/detail, linked flows/runs, folder collapse, per-request and per-section copy links, plus Markdown/HTML export |
| AI | conversation agent calls `api_studio`; no in-panel AI page |

## Deliberate local-first boundaries

- OpenAPI import accepts JSON and YAML.
- No cloud sync, teams, SSO, permissions, comments, or CI runner.
- No cloud mock, WebSocket/SSE/GraphQL/gRPC/SOAP/Dubbo/Socket protocols.
- No database steps, external program calls, or scheduled tasks.
- No performance/contract/regression suites beyond flows and assertions.

These are separate platform and protocol features, not omissions in the HTTP
request/test workflow that AirPost targets.
