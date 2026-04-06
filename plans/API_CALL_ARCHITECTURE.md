# EduConnect API Calling Architecture

This project now follows the same reusable flow you requested:

Config -> Client Provider -> Collection Helper -> Base Client -> HTTP Layer -> Vue/Store Caller

## 1) High-level flow

1. Config layer resolves host, token, and optional API metadata.
2. Provider layer exposes endpoint-specific client instances.
3. Collection helper layer prepares paging/filter payloads.
4. Base client layer builds URL and delegates request methods.
5. HTTP layer executes fetch and normalizes success/error payloads.
6. Services/stores/pages call these methods and consume consistent ApiResponse objects.

## 2) Config layer

Primary file:
- src/services/api/client.ts
- src/services/api/client.js (JS-first import facade)

How it works:
- getApiBaseUrl() resolves URL from runtime config, then env fallback.
- getApiConfig() resolves:
  - host
  - apiKey (if provided by runtime/env)
  - authToken from localStorage
  - deviceId from localStorage
  - dbId from localStorage
- This keeps request metadata centralized and reusable.

## 3) Client provider layer

Primary file:
- src/services/api/providers.js

How it works:
- createClientProvider() memoizes one client instance per domain.
- Domain providers return BaseApiClient instances with endpoint roots:
  - useAuthApiClient() -> /api/auth
  - useAiApiClient() -> /api/ai
  - useSocialApiClient() -> /api/social
  - useMeetingApiClient() -> /api/meetings
  - useClassroomApiClient() -> /api/classroom

## 4) Collection helper layer

Primary file:
- src/services/api/collections.js

How it works:
- createPagedCollectionFetcher(client, searchPath) standardizes paged search calls.
- Injects normalized paging payload (page/size).
- readPagedResponse() normalizes backend response shapes into:
  - list
  - total

This mirrors your old usePagedCollection pattern while fitting current project structure.

JS note:
- If you prefer JavaScript-only imports in features, import from client.js/providers.js/collections.js.
- Existing TypeScript service modules continue to work unchanged.

## 5) Base client layer

Primary file:
- src/services/api/client.ts

How it works:
- BaseApiClient encapsulates endpoint root and HTTP methods:
  - get/post/put/patch/delete/search/request
- URL building is handled in one place via buildUrl(path).
- apiRequest() remains available as a compatibility wrapper for existing services.
- apiRequestForm() supports multipart/form-data endpoints via the same pipeline.

## 6) HTTP execution layer

Primary file:
- src/services/api/client.ts

How it works:
- HttpClient.makeRequest(url, method, body, headers) executes fetch.
- Adds headers consistently:
  - Authorization (Bearer token)
  - X-API-KEY (if configured)
  - X-DEVICE-ID (if available)
  - X-DB-ID (if available)
- Parses JSON/text safely.
- Returns normalized ApiResponse:
  - success
  - data
  - error
  - token
  - status

## 7) Caller layer in this repo

Current examples:
- src/services/api/auth.ts
- src/services/api/chat.ts
- src/services/api/meeting.ts
- src/services/api/social.ts
- src/services/api/classroom.ts
- src/stores/*.ts and src/pages/*.vue consume these service methods.

Example behavior:
- Social media upload endpoints now use apiRequestForm() instead of direct fetch.
- Other service calls continue using apiRequest(), but now all flow through the new centralized architecture.

## 8) Architecture summary

All API calls can now follow one reusable pattern:

1. getApiConfig resolves host/token/metadata.
2. provider gives the endpoint client.
3. collection helper shapes filters/pagination when needed.
4. base client builds URL + delegates method.
5. HTTP client executes and normalizes result.
6. services/pages/stores consume a consistent ApiResponse contract.

This keeps endpoint logic simple, removes duplicated fetch logic, and makes future migration to fully provider-based service modules straightforward.
