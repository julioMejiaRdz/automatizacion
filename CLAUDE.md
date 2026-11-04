# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es

Plantilla (boilerplate) para proyectos de automatización en tiempo real: los PLC publican por MQTT a Mosquitto → el backend Express se suscribe y reenvía cada lectura por Socket.IO → un dashboard React autenticado la muestra. Todo en español: comentarios, UI, mensajes de error de la API y documentación (los identificadores de código en inglés). El README es la documentación de uso; aquí solo lo necesario para trabajar en el código.

## Comandos

Desde la raíz (orquesta `backend/` y `frontend/`, que son proyectos npm independientes):

- `npm run install:all` · `npm run dev` (ambos en paralelo) · `npm run build` · `npm run lint` · `npm run typecheck` · `npm test` · `npm run format`
- `npm run infra:up` levanta MongoDB, Mosquitto (anónimo) y Mailpit (`http://localhost:8025`) para desarrollo.
- `npm run seed` crea/actualiza los dispositivos de `backend/src/scripts/seed.ts`.

Por proyecto: `npm run <script> --prefix backend|frontend`. Un solo test: `npx vitest run tests/mqtt.test.ts` en `backend/`, o `npx vitest run src/api/errors.test.ts` en `frontend/`. Los tests del backend no usan MongoDB (solo rutas que responden antes de consultar la base); `tests/setup.ts` define las variables de entorno mínimas.

## Arquitectura

**Backend** (`backend/src`, CommonJS, TypeScript estricto, ejecutado con `tsx` en desarrollo):

- `config/env.ts` valida `process.env` con zod al importarse y termina el proceso si falta algo. Usa siempre `env` en lugar de `process.env`.
- `server.ts` exporta `createApp()` (Express sin abrir puerto, usado por los tests). `index.ts` conecta MongoDB, crea el servidor HTTP, `initWebSocket` y `initMqtt(emitReading)`, y maneja SIGTERM.
- Express 5: las excepciones de controladores async llegan solas a `middleware/errorHandler.ts`, por eso los controladores no usan try/catch. Patrón de rutas: cadena de `express-validator` → `handleInputErrors` (400 `{ errors }`) → controlador (errores de negocio `{ error }`).
- `services/mqtt`: mapa `topic → deviceId` cargado de la colección `Device`; `syncDeviceSubscriptions()` se llama al conectar, en cada alta/cambio/baja de dispositivo (`DeviceController`) y cada 30 s (para cambios hechos desde otro proceso, como el seed). `parsePayload` normaliza el JSON plano en `{ deviceId, timestamp, values }` y guarda la última lectura por dispositivo.
- `services/websocket`: `socketAuth` valida el JWT de `handshake.auth.token`; `join-device` (con ack) une a la room `device-{id}` si el dispositivo existe y envía la última lectura; el servidor emite `device-reading`. No hay permisos por usuario sobre dispositivos (decisión de la plantilla).
- `Device._id` es un string (el ID del dispositivo), no un ObjectId. `Token` usa un índice TTL de 10 min sobre `createdAt`.
- Correos con Nodemailer (`config/mailer.ts`, `emails/AuthEmail.ts`); en desarrollo van a Mailpit.

**Frontend** (`frontend/src`, alias `@/` → `src/`):

- JWT en `localStorage` (`AUTH_TOKEN_KEY` de `lib/config.ts`); `lib/axios.ts` lo envía como Bearer y `lib/socket.ts` como auth de Socket.IO (singleton con `autoConnect: false`). Sin `VITE_WS_URL` el socket usa el mismo origen (producción detrás de Nginx).
- `router.tsx` carga layouts y vistas con `lazy`. `AppLayout` protege las rutas con `useAuth` (React Query `['user']`), monta el sidebar de shadcn y `SocketProvider`. Nuevas vistas: ruta en `router.tsx` + entrada en `NAV_ITEMS` de `components/AppSidebar.tsx`.
- `hooks/useDeviceReadings` se une a las rooms y se re-une en cada reconexión. `api/errors.ts#toApiError` convierte errores de axios en `Error` con el mensaje del backend.
- UI: Tailwind 4 + shadcn/ui (`components/ui/`, generado por el CLI, excluido de Prettier y con reglas de ESLint relajadas). shadcn 4 usa el paquete `cn` (no clsx/tailwind-merge); `lib/utils.ts` lo reexporta. El tema oscuro es la clase `dark` en `<html>`, aplicada antes de pintar por `public/theme-init.js` (archivo externo para permitir CSP `script-src 'self'`).

**Docker**:

- `docker-compose.yml`: solo infraestructura de desarrollo, puertos en 127.0.0.1.
- `docker-compose.prod.yml`: `web` (imagen de `docker/nginx/Dockerfile`, contexto raíz: compila el frontend y lo sirve con Nginx), `backend`, `mongo` (red interna), `mosquitto` y `certbot` (solo con el perfil `letsencrypt`). `TLS_MODE` (`none` por defecto para LAN, `custom`, `letsencrypt`) lo interpreta `docker/nginx/40-app-config.sh`, que genera la config desde `docker/nginx/templates/` (HTTP o HTTPS) y, en `letsencrypt`, cambia a HTTPS sola al emitirse el certificado. HSTS se envía solo sobre HTTPS (`map $scheme` en `http-common.conf`). Nginx reenvía el `Host` original y el CORS del backend acepta peticiones del mismo origen, así que la app funciona con cualquier IP o nombre del servidor; `FRONTEND_URL` (`PUBLIC_URL` en producción) solo se usa para Vite en desarrollo y para los enlaces de los correos. Los scripts/configs para contenedores deben quedar con LF (`.gitattributes`).

## Versiones

TypeScript se mantiene en 6.0 porque typescript-eslint aún no soporta TypeScript 7. El frontend usa happy-dom para los tests porque jsdom 30 exige Node ≥ 24.15.
