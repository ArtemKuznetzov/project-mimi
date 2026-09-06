# project-mimi-ui

Vite SPA: React 19, TypeScript, RTK Query, React Router, Tailwind, FSD under `src/`. Not Next.js. Ignore App Router, RSC, `next/image`, `next/dynamic`, and server-only fetching from generic React skills. Code-split with `React.lazy` + `Suspense`. HTTP goes through existing `baseApi`, not SWR and not a second client.

## Layers

| Layer | Path | Put new work here |
|---|---|---|
| app | `src/app/` | store, routes, providers, typed Redux hooks |
| pages | `src/pages/` | thin screens that compose features |
| widgets | `src/widgets/` | chrome (nav) |
| features | `src/features/{auth,dialogs,messages}/` | use-cases |
| entities | `src/entities/message/` | `UiMessage` |
| shared | `src/shared/` | API, ui kit, config, lib |

Pages stay thin. Imports use `@/` (`src/`). Follow **auth** for a public surface: `api/` + `model/` + `ui/` + `index.ts`. Other features may omit `index.ts`; match the feature you are extending.

Primitives live in `shared/ui` (forwardRef, `cn` from `@/lib/utils`, token classes). Chat-only UI lives under `features/messages/ui/<kebab-folder>/`.

Session (`accessToken`, `userId`) stays in `authSlice`. Message lists stay in feature hooks, not a new Redux slice. Use `useAppDispatch` / `useAppSelector` from `@/app/hooks`.

RHF + Zod for structured forms aligned to DTOs (`LoginForm`). Chat composer stays local `useState`.

## HTTP and types

One client: `src/shared/api/baseApi.ts` (`fetchBaseQuery`, Bearer from `state.auth.accessToken`, `credentials: "include"`, refresh on 401). Add endpoints with `baseApi.injectEndpoints` in `features/<name>/api/<name>Api.ts`. Types from `@/shared/api/generated` (aliases in `index.ts`).

Contract change: update `project-mimi-server/api-specs/*.yaml` and/or the service, then `npm run generate:api-types` or `generate:api-types:local`. New schemas: add an alias in `generated/index.ts`.

Treat as generated (regenerate, do not hand-edit): `auth-api.ts`, `chat-api.ts`, `chat-ws.ts`, `media-api.ts`. File view URLs: `shared/lib/mediaUrls.ts`.

## Chat

Live list, optimistic updates, and WS merge: `useDialogMessagesState`, `useDialogReadState`. STOMP: `src/shared/lib/websoket/` (keep this folder until a coordinated rename). One client (`createStompClient` + `useChatWebsoket`).

Topics: `/topic/dialogs/:id` plus `/read`, `/delete`, `/edit`, `/add-reaction`. Publish `/app/dialogs/...`.

In message hooks: `handle*` = inbound WS; `on*` = user actions that send WS/HTTP. Pages compose hooks; they do not subscribe to STOMP directly. Attachments: existing `sendMessage` mutation (multipart).
