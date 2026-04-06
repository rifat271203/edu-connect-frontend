# EduConnect A-to-Z Project Map

Last updated: 2026-04-01

## 1) Project Snapshot

- Framework: Nuxt 3 (`srcDir: src/`)
- UI stack: Vue 3 + Tailwind CSS + custom CSS variables
- State: Pinia stores
- API layer: `src/services/api/*` + shared `apiRequest` client
- Real-time: `socket.io-client` + WebRTC composables
- Server route in Nuxt app: upload proxy at `server/routes/uploads/[...path].ts`
- Auth gate: global middleware `src/middleware/auth.global.ts`

## 2) Environment and Runtime Config

Frontend reads these public env values (from `nuxt.config.ts` runtime config):

- `NUXT_PUBLIC_API_URL`
- `NUXT_PUBLIC_SIGNAL_URL`
- `NUXT_PUBLIC_STUN_URL`
- `NUXT_PUBLIC_TURN_URL`
- `NUXT_PUBLIC_TURN_USER`
- `NUXT_PUBLIC_TURN_PASS`
- `NUXT_PUBLIC_BACKEND_URL`
- `NUXT_PUBLIC_SOCKET_URL`
- `NUXT_PUBLIC_ICE_SERVERS`

Important runtime behavior:

- `/meeting/**` has SSR disabled.
- API token is read from local storage and sent as `Authorization: Bearer <token>`.
- Upload URLs pointing to Railway are rewritten to `/uploads/...` for proxy serving.

## 3) Full Page and Route Inventory (A to Z)

### Core Pages

| File | Route | Layout | Auth behavior | Main purpose |
|---|---|---|---|---|
| `src/pages/index.vue` | `/` | `default` | middleware active | Redirect entry route (to `/login`) |
| `src/pages/login.vue` | `/login` | `blank` | guest allowed | Main login/register landing UI |
| `src/pages/loginV2.vue` | `/loginV2` | `blank` | middleware active | Alternative login screen |
| `src/pages/EduConnectLogin.vue` | `/EduConnectLogin` | `blank` | middleware active | Another login variant |
| `src/pages/home.vue` | `/home` | `main` | guest allowed | Social home/feed + posting |
| `src/pages/courses.vue` | `/courses` | `main` | middleware active | Classroom redirect/helper page |
| `src/pages/ai-tutor.vue` | `/ai-tutor` | `main` | guest allowed | AI tutor chat (math/physics/chemistry) |
| `src/pages/messages.vue` | `/messages` | `main` | middleware active | Direct messaging + user search |
| `src/pages/settings.vue` | `/settings` | `main` | middleware active | Password, profile visibility, theme |

### Profile Pages

| File | Route | Layout | Auth behavior | Main purpose |
|---|---|---|---|---|
| `src/pages/profile/index.vue` | `/profile` | `main` | middleware active | My profile, activity, visibility |
| `src/pages/profile/[id].vue` | `/profile/:id` | `main` | middleware active | Public profile view + friend actions |

### Classroom Hub and Live Pages

| File | Route | Layout | Auth behavior | Main purpose |
|---|---|---|---|---|
| `src/pages/classroom/index.vue` | `/classroom` | `main` | middleware active | Course feed, enrollment requests, meeting create/join |
| `src/pages/classroom/[roomId].vue` | `/classroom/:roomId` | `blank` | middleware active | Live classroom session UI |
| `src/pages/meeting/[roomId].vue` | `/meeting/:roomId` | `blank` | middleware active, SSR off | WebRTC meeting experience |

### Classroom Course Sub-Pages

| File | Route | Layout | Data source trend | Main purpose |
|---|---|---|---|---|
| `src/pages/classroom/[courseId]/index.vue` | `/classroom/:courseId` | `classroom` | mixed | Course overview |
| `src/pages/classroom/[courseId]/messages.vue` | `/classroom/:courseId/messages` | `classroom` | mostly local/socket | Class chat |
| `src/pages/classroom/[courseId]/notes.vue` | `/classroom/:courseId/notes` | `classroom` | mostly local | Materials/notes |
| `src/pages/classroom/[courseId]/notices.vue` | `/classroom/:courseId/notices` | `classroom` | mostly local | Notices |
| `src/pages/classroom/[courseId]/schedule.vue` | `/classroom/:courseId/schedule` | `classroom` | mostly local | Schedule |
| `src/pages/classroom/[courseId]/progress.vue` | `/classroom/:courseId/progress` | `classroom` | mostly local | Progress view |
| `src/pages/classroom/[courseId]/assignments/index.vue` | `/classroom/:courseId/assignments` | `classroom` | mostly local | Assignment list |
| `src/pages/classroom/[courseId]/assignments/[assignmentId].vue` | `/classroom/:courseId/assignments/:assignmentId` | `classroom` | mostly local | Assignment detail/submission |
| `src/pages/classroom/[courseId]/exams/index.vue` | `/classroom/:courseId/exams` | `classroom` | mostly local | Exam list |
| `src/pages/classroom/[courseId]/exams/[examId]/index.vue` | `/classroom/:courseId/exams/:examId` | `classroom` | mostly local | Exam overview |
| `src/pages/classroom/[courseId]/exams/[examId]/take.vue` | `/classroom/:courseId/exams/:examId/take` | `blank` | mostly local | Exam attempt |
| `src/pages/classroom/[courseId]/exams/[examId]/result.vue` | `/classroom/:courseId/exams/:examId/result` | `classroom` | mostly local | Exam result |

## 4) Full Service/API Call Inventory

## 4.1 Auth Service (`src/services/api/auth.ts`)

- `POST /api/auth/{role}s/login`
- `POST /api/auth/{role}s/register`
- `GET /api/auth/me`
- `PATCH /api/auth/password`

Notes:

- Role-aware endpoint builder is used (`teacher` or `student`).
- Response is normalized in frontend to unify API variations.

## 4.2 AI Tutor Service (`src/services/api/chat.ts`)

- `POST /api/ai/ask`

Notes:

- Request: `{ question, subject, category }`
- Response supports structured math/physics/chemistry payloads.

## 4.3 Meeting Service (`src/services/api/meeting.ts`)

- `POST /api/meetings/create`
- `GET /api/meetings/:roomId`
- `POST /api/meetings/:roomId/end`

## 4.4 Classroom Service (`src/services/api/classroom.ts`)

- `POST /api/classroom/courses`
- `GET /api/classroom/courses?...query`
- `PATCH /api/classroom/courses/:courseId`
- `PATCH /api/classroom/courses/:courseId/archive`
- `PATCH /api/classroom/courses/:courseId/activate`
- `POST /api/classroom/courses/:courseId/enrollment-requests`
- `GET /api/classroom/courses/:courseId/enrollment-requests`
- `PATCH /api/classroom/courses/:courseId/enrollment-requests/:requestId/approve`
- `PATCH /api/classroom/courses/:courseId/enrollment-requests/:requestId/reject`
- `GET /api/classroom/me/enrollments`

## 4.5 Social Service (`src/services/api/social.ts`)

Posts and comments:

- `POST /api/social/posts`
- `GET /api/social/posts?limit=&offset=`
- `GET /api/social/posts/:postId`
- `PATCH /api/social/posts/:postId`
- `DELETE /api/social/posts/:postId`
- `POST /api/social/posts/:postId/likes`
- `DELETE /api/social/posts/:postId/likes`
- `POST /api/social/posts/:postId/comments`
- `DELETE /api/social/comments/:commentId`
- `POST /api/social/posts/:postId/shares`
- `GET /api/social/shares`

Media/profile:

- `POST /api/social/upload-media` (multipart)
- `POST /api/social/me/profile-pic` (multipart)
- `GET /api/social/me/profile`
- `GET /api/social/me/activity?limit=&offset=`
- `GET /api/social/me/profile-visibility`
- `PATCH /api/social/me/profile-visibility`
- `GET /api/social/users/:userId/profile?includePosts=&includeFriends=`

Notifications:

- `GET /api/social/notifications?limit=&offset=`
- `GET /api/social/notifications/unread-count`
- `PATCH /api/social/notifications/:notificationId/read`
- `PATCH /api/social/notifications/read-all`

Friends and search:

- `POST /api/social/friend-requests`
- `GET /api/social/friend-requests`
- `PATCH /api/social/friend-requests/:requestId/respond`
- `DELETE /api/social/friend-requests/:requestId`
- `GET /api/social/friends`
- `DELETE /api/social/friends/:friendId`
- `GET /api/social/search?q=...&role=...&limit=...`

DM:

- `GET /api/social/dm/conversations?limit=&offset=`
- `GET /api/social/dm/messages/:userId?limit=&beforeId=`
- `POST /api/social/dm/messages`
- `PATCH /api/social/dm/messages/:messageId/read`

## 4.6 Additional Direct API Calls from Stores (`src/stores/session.ts`)

- `POST /api/v1/auth/token`
- `POST /api/v1/sessions`
- `GET /api/v1/sessions/:roomId`
- `POST /api/v1/sessions/:roomId/end`

This is separate from `src/services/api/meeting.ts` and powers classroom session flow.

## 5) Page-to-Service Mapping

| Page | Store/composable/service usage | Backend calls involved |
|---|---|---|
| `/login` | direct auth service + user store | auth login/register endpoints |
| `/home` | `usePostsStore`, `useUserStore`, `useClassroomStore` | social posts/media + classroom course/enrollment endpoints |
| `/ai-tutor` | direct `sendChatMessage` + user store | `/api/ai/ask` |
| `/messages` | social DM/friend/search calls + user store | social search, dm, friend request endpoints |
| `/settings` | auth/social service + user store | password + profile visibility endpoints |
| `/profile` | social profile/activity/visibility + user store | profile/activity/visibility endpoints |
| `/profile/:id` | social public profile + friend calls | public profile + friend endpoints |
| `/classroom` | classroom store + meeting service + social upload helper | classroom endpoints + meeting create |
| `/meeting/:roomId` | `useMeetingSocket`, meeting service, user store | `/api/meetings/:roomId/end` + socket signaling |
| `/classroom/:roomId` | `useSessionStore`, signaling/webrtc/media composables | `/api/v1/*` session endpoints + socket signaling |
| Course sub-pages | classroom + assignment/exam/schedule/progress/notice/material stores | mostly local seeded data, limited backend usage |

## 6) UI/UX Detailed Clarification

## 6.1 Visual System

Global token systems are mixed:

- Main theme variables in `src/assets/css/main.css` (light + dark + semantic aliases)
- Tailwind extensions in `tailwind.config.ts`
- Some page-level local token blocks (for specific high-impact pages)

Typography:

- Global in CSS import: `DM Sans` + `Fraunces`
- Nuxt head preloads: `Instrument Serif`, `Manrope`, `DM Mono`
- Tailwind families map to `Manrope` (sans), `Instrument Serif` (display), `DM Mono` (mono)

## 6.2 Layout System

- `src/layouts/main.vue`
  - Desktop left sidebar
  - Optional right sidebar (hidden on ai-tutor/messages)
  - Mobile top bar + mobile drawer + bottom nav
  - First-login profile-picture modal
- `src/layouts/classroom.vue`
  - Classroom-specific left navigation
  - Mobile course tabs
  - Role badge + contextual course header
- `src/layouts/blank.vue`
  - Minimal dark shell for auth/fullscreen pages
- `src/layouts/default.vue`
  - Wraps main layout

## 6.3 Reusable UI Components

Core base components:

- `BaseButton`, `BaseCard`, `BaseInput`, `BaseSelect`, `BaseModal`, `BaseToast`, `BaseBadge`

Domain component groups:

- `components/layout/*`: navigation shell
- `components/classroom/*`: meeting/classroom widgets (grid, control bar, participant panels)
- `components/ai-tutor/*`: subject-specific response renderers and tutor UI blocks

## 6.4 Interaction Patterns

- Infinite-ish post loading and optimistic likes/comments in posts store
- AI tutor subject switching + rich message rendering
- Mobile-first adaptive navigation in layouts
- Live session controls use composables for media devices, signaling, and peer lifecycle
- Notification badge and friend-request actions supported from notifications store

## 7) Backend A-to-Z Clarification (From Frontend Integration View)

## 7.1 Auth Backend

Expected responsibilities:

- Role-based register/login endpoints for student/teacher
- JWT token issuance and validation
- `/api/auth/me` current user hydration
- password change endpoint

Frontend assumptions:

- JWT stored in local storage and mirrored to cookie
- no refresh-token flow currently implemented on frontend

## 7.2 Social Backend

Expected responsibilities:

- Feed CRUD, likes, comments, shares
- notifications and unread counts
- friend request workflow and friend list
- profile and profile-visibility management
- DM conversations/messages/read status
- search endpoint for users/posts
- media upload endpoint and profile picture upload endpoint

Frontend assumptions:

- multiple possible response shapes are normalized client-side
- profile/media URLs may come as absolute Railway URL and are rewritten by frontend

## 7.3 Classroom Backend

Expected responsibilities:

- course CRUD and status transitions
- enrollment request lifecycle (create/list/approve/reject)
- my enrollment listing

Frontend assumptions:

- current course context is derived via either teacher course list or student enrollment list

## 7.4 Session + Meeting Backend

There are two meeting/session API tracks used by frontend:

1) Generic meeting service track:
- `/api/meetings/create`
- `/api/meetings/:roomId`
- `/api/meetings/:roomId/end`

2) Classroom session track from session store:
- `/api/v1/auth/token`
- `/api/v1/sessions`
- `/api/v1/sessions/:roomId`
- `/api/v1/sessions/:roomId/end`

You should keep both available unless you unify frontend code paths.

## 7.5 Real-Time/Socket Backend

Expected socket capabilities:

- room join and participant presence sync
- SDP offer/answer relay
- ICE candidate relay
- classroom chat events
- user-joined/user-left notifications
- optional waiting-room admit flow

## 7.6 Upload Proxy Backend Clarification

- Nuxt server route `server/routes/uploads/[...path].ts` proxies upload assets.
- It helps avoid browser cross-origin policy problems when media comes from backend host.

## 8) What Is Real API vs Local Mock/Seed Right Now

Mostly API-backed:

- auth, social feed/profile/dm/notifications/friends, classroom course enrollment, ai tutor, meeting create/end

Mostly local seed/in-memory (frontend stores):

- `src/stores/assignment.ts`
- `src/stores/exam.ts`
- `src/stores/schedule.ts`
- `src/stores/notice.ts`
- `src/stores/material.ts`
- `src/stores/progress.ts`
- `src/stores/chat.ts`

This means many classroom sub-pages are currently demo/local-data oriented and not fully backend-persisted.

## 9) Key Gaps and Recommendations

1. Unify login entry strategy (`/login`, `/loginV2`, `/EduConnectLogin`) to one production path.
2. Decide whether classroom live flow should use `/api/meetings/*` or `/api/v1/sessions/*` as canonical.
3. Add refresh-token or token-expiry handling strategy.
4. Replace local seeded classroom stores with backend-backed modules for production.
5. Add backend contracts for recording if recording UI is intended to be real.
6. Add consistent error contracts for AI tutor schema to avoid render-time mismatch.

## 10) Quick Developer Checklist

- Verify `.env` has backend URL, socket URL, and ICE config.
- Confirm both auth roles are supported by backend (`teacher`, `student`).
- Confirm social endpoints listed above are available.
- Confirm classroom and session endpoints both exist (or refactor frontend to one).
- Confirm socket events and payload schema used by composables.
- Confirm upload proxy path `/uploads/*` resolves correctly in production.
