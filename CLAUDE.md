# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Template for real-time IoT automation: PLC devices publish readings to a Mosquitto MQTT broker → the Express backend subscribes and relays each payload over Socket.IO → an authenticated React dashboard renders it live. Two independent npm projects, `backend/` and `frontend/` — there is no root `package.json`, so run commands from inside each folder. Code comments, UI text and API error messages are in Spanish; keep that convention.

## Commands

Backend (`backend/`, needs MongoDB, plus a broker if `MQTT_HOST` is set; copy `.env.example` → `.env`):
- `npm run dev` — nodemon + ts-node on `src/index.ts` (port 3000)
- `npm run dev:api` — same, but passes `--api`, which makes CORS also accept requests with no `Origin` (Postman/curl)
- `npm run build` / `npm start` — `tsc` to `dist/`, then run it

Frontend (`frontend/`, copy `.env.example` → `.env.local`):
- `npm run dev` — Vite on port 5173
- `npm run build` — `tsc -b && vite build` (this is the type check)
- `npm run lint` — ESLint

There is no test suite in either project.

## Architecture

**Backend data path** (`backend/src`): `index.ts` only calls `listen`; `server.ts` loads dotenv, connects Mongo, mounts `/api/auth`, then calls `webSocket(server)` (`services/websocket`). That function creates the Socket.IO server, applies `socketAuth` (verifies the JWT from `socket.handshake.auth.token`), and calls `initMqtt(io)` — so the MQTT client lives inside the WebSocket service. Clients emit `join-device` with a device id to join room `device-{id}`. The MQTT service JSON-parses each message, takes the device id from the second topic segment (`opp/<deviceId>`), and emits `mqtt-message` `{ topic, data }` to that room.

Currently hardcoded / unfinished:
- The MQTT subscription is a single literal topic (`opp/A24308160`) and `DashboardView` hardcodes the same `deviceId`. The `Device` model (`_id`, `topic`, `fields[{key, unit}]`) exists but is not used anywhere yet — it is meant to drive subscriptions and dashboard fields.
- Auth flow creates 6-digit confirmation/reset tokens (`utils/token.ts`, `Token` model) but no email is actually sent.
- Backend `tsconfig` has `strict: false`.

**Auth**: `POST /api/auth/login` returns a raw JWT string (1-day expiry, payload `{ id }`). Routes validate with `express-validator` chains followed by `handleInputErrors` (400 `{ errors }`); controllers return `{ error: message }` on failure. `authenticate` middleware puts the user on `req.user`.

**Frontend** (`frontend/src`, `@/` aliases `src/`):
- The JWT is stored in `localStorage` under `AUTH_TOKEN`; `lib/axios.ts` adds it as a Bearer header, and `lib/socket.ts` sends it as Socket.IO auth (a callback, so it's re-read on each connect). The socket is a module singleton with `autoConnect: false`.
- `AppLayout` gates protected routes with `useAuth` (React Query `['user']` → `GET /auth/user`), redirects to `/auth/login` on error, and wraps children in `SocketProvider`, which connects on mount / disconnects on unmount. Views access the socket via `useSocket()`.
- API functions in `api/AuthAPI.ts` rethrow `error.response.data.error` as `Error` for React Query mutations. Types/schemas live in `types/index.ts` and use `zod`, which is imported but not declared in `frontend/package.json` (works only via a transitive install).
- UI is Tailwind v4 + shadcn (`components.json`, new-york style, `@magicui` registry) under `components/ui`. Dark mode is a `dark` class on `<html>`, set before render by an inline script injected by the `themeInitPlugin` in `vite.config.ts` (reads `localStorage.theme`).

## Environment

Backend: `DATABASE_URL`, `PORT`, `FRONTEND_URL` (the only allowed CORS origin, for both REST and Socket.IO), `MQTT_HOST` / `MQTT_USER` / `MQTT_PASSWORD` (MQTT is skipped if `MQTT_HOST` is unset), `JWT_SECRET`.
Frontend: `VITE_API_URL` (includes `/api`), `VITE_WS_URL`.
