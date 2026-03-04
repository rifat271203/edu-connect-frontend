# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Meeting Feature Configuration

The WebRTC meeting page uses backend HTTP APIs and Socket.IO signaling.

### Required environment variables

Create a local env file (`.env`) with:

```bash
NUXT_PUBLIC_BACKEND_URL=http://localhost:3001
NUXT_PUBLIC_SOCKET_URL=http://localhost:3001
NUXT_PUBLIC_ICE_SERVERS=[{"urls":"stun:stun.l.google.com:19302"}]
```

- `NUXT_PUBLIC_BACKEND_URL`: Base URL for REST requests (e.g. `/api/meetings/create`)
- `NUXT_PUBLIC_SOCKET_URL`: Socket.IO signaling server URL
- `NUXT_PUBLIC_ICE_SERVERS`: JSON array of WebRTC ICE servers (STUN/TURN)

TURN example (recommended for real devices/networks):

```bash
NUXT_PUBLIC_ICE_SERVERS=[{"urls":"stun:stun.l.google.com:19302"},{"urls":"turn:YOUR_TURN_HOST:3478","username":"YOUR_TURN_USERNAME","credential":"YOUR_TURN_PASSWORD"}]
```

If `NUXT_PUBLIC_SOCKET_URL` is not set, the app falls back to `NUXT_PUBLIC_BACKEND_URL`.

### Meeting routes and flow

- Create a meeting from Classroom: `/classroom` → **Create Meeting**
- Join/share meeting room: `/meeting/:roomId`

The meeting page is client-only (`/meeting/**` SSR disabled) and includes:

- Local camera + microphone stream
- Mesh WebRTC peer connections for current room participants
- Socket events for `join-room`, `offer`, `answer`, and `ice-candidate`
- Controls for mute/unmute, camera on/off, copy link, and leave

### Backend expectations

Meeting UI expects these backend endpoints/events to exist:

- `POST /api/meetings/create`
- `GET /api/meetings/:roomId`
- `POST /api/meetings/:roomId/end`
- Socket.IO signaling events:
  - client emits: `join-room`, `offer`, `answer`, `ice-candidate`
  - client listens: `room-users`, `user-joined`, `offer`, `answer`, `ice-candidate`, `user-left`
