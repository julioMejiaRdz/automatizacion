# Automatización — Plantilla IoT MQTT + WebSocket

Plantilla base para proyectos de automatización en tiempo real. Los PLC/sensores publican lecturas por MQTT, el backend las reenvía por Socket.IO y un dashboard React autenticado las muestra en vivo.

Incluye autenticación completa (registro, confirmación por correo, recuperación de contraseña, perfil), gestión de dispositivos por API, entorno de desarrollo con Docker y un stack de producción dockerizado que funciona en la red local del cliente solo con HTTP o con HTTPS (certificado propio o Let's Encrypt).

---

## Stack

| Capa          | Tecnología                                                                            |
| ------------- | ------------------------------------------------------------------------------------- |
| Broker        | Mosquitto 2.1 (MQTT)                                                                  |
| Backend       | Node.js 24 · TypeScript 6 · Express 5 · Socket.IO 4 · Mongoose 9 · Nodemailer         |
| Frontend      | React 19 · Vite 8 · TypeScript 6 · Tailwind CSS 4 · shadcn/ui · TanStack Query        |
| Base de datos | MongoDB 8                                                                             |
| Seguridad     | JWT · bcrypt · helmet · express-rate-limit · validación de variables de entorno (zod) |
| Calidad       | ESLint · Prettier · Vitest                                                            |
| Producción    | Docker Compose · Nginx (reverse proxy; HTTP, HTTPS propio o Let's Encrypt) · certbot  |

---

## Arquitectura

```
PLC / sensores
     │  MQTT publish (JSON plano, un topic por dispositivo)
     ▼
Mosquitto ──────────────────────────────────────────────┐
     │  mqtt://                                          │
     ▼                                                   │
Backend (Node.js)                                        │
 ├── Express REST  /api/auth, /api/devices, /api/health  │
 ├── Servicio MQTT  se suscribe a los topics de la colección Device
 └── Socket.IO      emite `device-reading` a la room `device-{id}`
     │  ws://  (JWT en el handshake)
     ▼
Frontend (React)
 ├── AppLayout (sidebar) + SocketProvider (conexión autenticada)
 └── DashboardView: una tarjeta por dispositivo con sus `fields`
```

**Flujo de datos**

1. Cada dispositivo se registra en MongoDB (colección `Device`) con su `topic` y los `fields` que se muestran.
2. Al arrancar (y cada vez que se crea, edita o borra un dispositivo) el backend se suscribe a esos topics.
3. Cuando llega un mensaje, el backend lo normaliza y emite `device-reading` a la room `device-{id}`.
4. El dashboard pide la lista de dispositivos, se une a sus rooms (`join-device`) y pinta cada lectura. Al unirse recibe de inmediato la última lectura conocida.

### Formato del payload MQTT

JSON plano publicado en el topic exacto del dispositivo:

```json
{ "timestamp": "2026-01-01T12:00:00Z", "temperatura": 25.4, "presion": 1.2, "en_marcha": true }
```

- `timestamp` es opcional; si falta se usa la hora en que llegó el mensaje.
- El resto de claves deben coincidir con `fields[].key` del dispositivo. Se aceptan números, texto, booleanos y `null`; los valores anidados se ignoran.

### Dispositivos

```json
{
  "id": "demo-001",
  "name": "Dispositivo de ejemplo",
  "topic": "planta/demo-001",
  "fields": [
    { "key": "temperatura", "label": "Temperatura", "unit": "°C" },
    { "key": "presion", "label": "Presión", "unit": "bar" }
  ]
}
```

- `id` es el identificador del dispositivo (p. ej. número de serie) y no se puede cambiar.
- `topic` debe ser único y sin comodines (`+`, `#`).
- `label` es opcional (si falta se muestra `key`).

No hay pantalla de administración: los dispositivos se gestionan con la API (requiere `Authorization: Bearer <token>`) o con el script de seed.

| Método | Ruta               | Descripción                            |
| ------ | ------------------ | -------------------------------------- |
| GET    | `/api/devices`     | Lista los dispositivos                 |
| GET    | `/api/devices/:id` | Un dispositivo                         |
| POST   | `/api/devices`     | Crea (`id`, `name`, `topic`, `fields`) |
| PUT    | `/api/devices/:id` | Actualiza (`name`, `topic`, `fields`)  |
| DELETE | `/api/devices/:id` | Elimina                                |

El seed (`npm run seed`) crea o actualiza los dispositivos definidos en `backend/src/scripts/seed.ts`; reemplaza el ejemplo por los del proyecto.

Los cambios hechos por la API se aplican a las suscripciones MQTT al instante. Los hechos desde otro proceso (el seed o ediciones directas en MongoDB) los toma el backend en menos de 30 segundos, sin reiniciarlo.

### Eventos de Socket.IO

| Dirección          | Evento           | Datos                                                   |
| ------------------ | ---------------- | ------------------------------------------------------- |
| cliente → servidor | `join-device`    | `deviceId`, ack `{ ok: true }` o `{ ok: false, error }` |
| cliente → servidor | `leave-device`   | `deviceId`                                              |
| servidor → cliente | `device-reading` | `{ deviceId, timestamp, values }`                       |

Cualquier usuario autenticado puede ver cualquier dispositivo; solo se valida que el dispositivo exista.

### API de autenticación

Todas bajo `/api/auth`. Las marcadas con 🔒 requieren token; las marcadas con ⏱ tienen rate limit (20 peticiones cada 15 min por IP).

| Método | Ruta                        | Descripción                                       |
| ------ | --------------------------- | ------------------------------------------------- |
| POST   | `/create-account` ⏱         | Registro; envía código de confirmación por correo |
| POST   | `/confirm-account` ⏱        | Confirma la cuenta con el código de 6 dígitos     |
| POST   | `/request-code` ⏱           | Reenvía el código de confirmación                 |
| POST   | `/login` ⏱                  | Devuelve el JWT (texto plano)                     |
| POST   | `/forgot-password` ⏱        | Envía código para restablecer la contraseña       |
| POST   | `/validate-token` ⏱         | Valida el código de restablecimiento              |
| POST   | `/update-password/:token` ⏱ | Define la nueva contraseña con el código          |
| GET    | `/user` 🔒                  | Usuario actual                                    |
| PUT    | `/profile` 🔒               | Actualiza nombre y email                          |
| POST   | `/update-password` 🔒       | Cambia la contraseña (pide la actual)             |
| POST   | `/check-password` 🔒 ⏱      | Verifica la contraseña actual                     |

Los códigos de confirmación y de recuperación expiran a los 10 minutos (índice TTL de MongoDB). Errores de negocio: `{ error }`; errores de validación: `{ errors: [{ msg, ... }] }`.

---

## Estructura

```
.
├── backend/
│   ├── src/
│   │   ├── config/        env.ts (validación de variables) · db · cors · mailer
│   │   ├── controllers/   AuthController · DeviceController
│   │   ├── emails/        plantillas de correo
│   │   ├── middleware/    auth (JWT) · socketAuth · rateLimit · validation · errorHandler
│   │   ├── models/        User · Token · Device
│   │   ├── routes/        authRoutes · deviceRoutes
│   │   ├── services/      mqtt/ (suscripciones y parseo) · websocket/ (Socket.IO y rooms)
│   │   ├── scripts/       seed.ts
│   │   ├── server.ts      crea la app Express (sin abrir el puerto, para tests)
│   │   └── index.ts       arranque: MongoDB, HTTP, Socket.IO, MQTT y apagado ordenado
│   ├── tests/             Vitest + supertest
│   └── Dockerfile
├── frontend/
│   ├── public/            favicon · theme-init.js (tema antes de pintar)
│   └── src/
│       ├── api/           AuthAPI · DeviceAPI · errors
│       ├── components/    AppSidebar · NavUser · auth/ · devices/ · ui/ (shadcn)
│       ├── context/       SocketContext · SocketProvider
│       ├── hooks/         useAuth · useDeviceReadings · useLogout · useTheme
│       ├── layouts/       AppLayout (sidebar) · AuthLayout
│       ├── lib/           axios · socket · config · utils
│       ├── views/         DashboardView · ProfileView · auth/
│       └── router.tsx     rutas con carga diferida
├── docker/
│   ├── nginx/             Dockerfile de la imagen web, plantillas y snippets
│   ├── certbot/           script de emisión/renovación
│   ├── mosquitto/         configuraciones dev/prod, acl.example, auth/ y certs/ (no versionados)
│   └── mongo/             creación del usuario de la aplicación
├── docker-compose.yml       infraestructura de desarrollo
├── docker-compose.prod.yml  stack de producción
└── package.json             scripts que orquestan ambos proyectos
```

---

## Desarrollo

### Requisitos

- Node.js 24 o superior
- Docker Desktop (o Docker Engine + Compose) para MongoDB, Mosquitto y Mailpit

### Primeros pasos

```bash
npm run install:all
```

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

En `backend/.env` cambia `JWT_SECRET` por una cadena aleatoria de al menos 32 caracteres. El resto de valores por defecto ya apuntan a los servicios de Docker.

```bash
npm run infra:up
```

> Si ya tienes MongoDB instalado en tu equipo (por ejemplo como servicio de Windows) el puerto 27017 estará ocupado y el contenedor `mongo` no arrancará. Puedes usar tu MongoDB local (el `DATABASE_URL` por defecto ya apunta a `localhost:27017`) y levantar solo el resto con `docker compose up -d mosquitto mailpit`, o detener el servicio local.

```bash
npm run seed
```

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000 (health check en `/api/health`)
- Mailpit (bandeja de los correos de desarrollo): http://localhost:8025

Al registrarte, el código de confirmación llega a Mailpit.

### Probar una lectura

Con el dispositivo de ejemplo del seed, publica un mensaje desde el contenedor de Mosquitto:

```bash
docker compose exec mosquitto mosquitto_pub -t planta/demo-001 -m '{"temperatura": 24.8, "presion": 1.1, "flujo": 12.5, "en_marcha": true}'
```

### Scripts (desde la raíz)

| Script                | Qué hace                                                              |
| --------------------- | --------------------------------------------------------------------- |
| `npm run install:all` | Instala dependencias de la raíz, backend y frontend                   |
| `npm run dev`         | Backend (`tsx watch`) y frontend (Vite) en paralelo                   |
| `npm run build`       | Compila backend y frontend                                            |
| `npm run lint`        | ESLint en ambos proyectos                                             |
| `npm run typecheck`   | Verificación de tipos en ambos proyectos                              |
| `npm test`            | Tests (Vitest) en ambos proyectos                                     |
| `npm run format`      | Formatea todo con Prettier (`format:check` solo verifica)             |
| `npm run seed`        | Crea/actualiza los dispositivos del seed                              |
| `npm run infra:up`    | Levanta MongoDB, Mosquitto y Mailpit (`infra:down` los detiene)       |
| `npm run prod:up`     | Construye y levanta el stack de producción (`prod:down`, `prod:logs`) |

Cada proyecto tiene además sus propios scripts (`npm run <script> --prefix backend`). Para un solo archivo de tests: `npx vitest run tests/mqtt.test.ts` dentro de `backend/` (o la ruta equivalente en `frontend/`).

### Variables de entorno de desarrollo

`backend/.env` (se valida al arrancar; si falta o es inválida alguna, el servidor indica cuál y se detiene):

| Variable                                                                  | Descripción                                                      |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `NODE_ENV`                                                                | `development` · `production` · `test`                            |
| `PORT`                                                                    | Puerto HTTP (3000)                                               |
| `FRONTEND_URL`                                                            | Origen permitido por CORS y base de los enlaces de los correos   |
| `TRUST_PROXY`                                                             | Proxies delante del backend (0 en desarrollo, 1 detrás de Nginx) |
| `DATABASE_URL`                                                            | URI de MongoDB                                                   |
| `JWT_SECRET`                                                              | Secreto para firmar los JWT (mín. 32 caracteres)                 |
| `JWT_EXPIRES_IN`                                                          | Duración del token (`1d`, `12h`...)                              |
| `MQTT_URL`                                                                | `mqtt://`, `mqtts://`, `ws://` o `wss://`                        |
| `MQTT_USER` / `MQTT_PASSWORD`                                             | Credenciales del broker (vacías en desarrollo)                   |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASSWORD` | Servidor SMTP                                                    |
| `MAIL_FROM`                                                               | Remitente de los correos                                         |

`frontend/.env.local` (se incrustan en el build):

| Variable        | Descripción                                              |
| --------------- | -------------------------------------------------------- |
| `VITE_APP_NAME` | Nombre en el login, el sidebar y el título de la pestaña |
| `VITE_API_URL`  | URL de la API, incluye `/api`                            |
| `VITE_WS_URL`   | URL de Socket.IO; vacía = mismo origen que el frontend   |

---

## Adaptar la plantilla a un proyecto nuevo

1. Cambia `VITE_APP_NAME` (y `APP_NAME` en producción) y el remitente `MAIL_FROM`.
2. Define tus dispositivos en `backend/src/scripts/seed.ts` o con la API, y haz que los PLC publiquen en el formato de payload descrito arriba.
3. Agrega vistas en `frontend/src/views/`, su ruta en `router.tsx` y su entrada en `NAV_ITEMS` de `components/AppSidebar.tsx`.
4. Agrega componentes de shadcn/ui con `npx shadcn add <componente>` dentro de `frontend/` (quedan en `components/ui/`).
5. Para nuevos recursos del backend sigue el patrón modelo → controlador → rutas (con `express-validator` + `handleInputErrors`) y móntalos en `server.ts`.
6. Si el proyecto necesita permisos por dispositivo, la validación va en el handler `join-device` de `services/websocket/index.ts` y en `deviceRoutes.ts`.

---

## Producción

Todo corre en Docker: Nginx sirve el frontend y hace de proxy de `/api` y `/socket.io` hacia el backend. MongoDB y el backend no se publican fuera del servidor. Mosquitto expone 1883 (red local, sin TLS) y 8883 (TLS); ambos exigen usuario y contraseña.

### Modos de acceso web (`TLS_MODE`)

| Modo          | Cuándo usarlo                                                               | Qué hace                                                                                                                          |
| ------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `none`        | Red local (LAN) del cliente, sin certificados. **Es el valor por defecto.** | Solo HTTP en el puerto 80. Sin HSTS ni certbot.                                                                                   |
| `custom`      | LAN con certificados propios (p. ej. de la CA corporativa del cliente)      | HTTPS con `docker/nginx/certs/server.crt` y `server.key`; HTTP redirige a HTTPS.                                                  |
| `letsencrypt` | Servidor accesible desde internet con dominio público                       | HTTPS con Let's Encrypt (servicio certbot). Arranca en HTTP, obtiene el certificado y cambia a HTTPS sola; renovación automática. |

En cualquier modo la app funciona con cualquier IP o nombre con el que se acceda al servidor (`http://192.168.1.50`, `http://servidor-planta`...). `PUBLIC_URL` solo define la URL que aparece en los correos.

Con `none`, la contraseña del login y el token viajan sin cifrar por la red local, y los navegadores muestran "No seguro" en el formulario de acceso. Es lo habitual en redes de planta aisladas; si la política del cliente exige cifrado, usa `custom`.

### 1. Requisitos del servidor

- Linux con Docker Engine y el plugin Compose.
- Puertos abiertos en el firewall: 80 (y 443 con `custom` o `letsencrypt`) para la web, 1883 hacia la red de planta y 8883 si hay PLC fuera de ella.
- Solo con `letsencrypt`: un dominio público con registro DNS A/AAAA apuntando al servidor y el puerto 80 accesible desde internet.

### 2. Variables

```bash
cp .env.production.example .env.production
chmod 600 .env.production
```

Completa los valores: `TLS_MODE`, `PUBLIC_URL` y los secretos. Usa contraseñas aleatorias sin caracteres especiales de URL (`openssl rand -hex 24`), porque las de MongoDB se insertan en la URI de conexión. Con `letsencrypt` descomenta `COMPOSE_PROFILES=letsencrypt` y define `DOMAIN` y `CERTBOT_EMAIL`.

### 3. Certificado web (solo `TLS_MODE=custom`)

Coloca el certificado (cadena completa) y su clave en `docker/nginx/certs/` con estos nombres:

```bash
cp ruta/al/certificado.crt docker/nginx/certs/server.crt
cp ruta/a/la/clave.key docker/nginx/certs/server.key
chmod 600 docker/nginx/certs/server.key
```

El certificado debe incluir la IP o el nombre con el que se accede (campo SAN) y los equipos de los usuarios deben confiar en la CA que lo firmó. Si faltan los archivos, el contenedor `web` no arranca y su log lo indica. Al reemplazarlos, reinicia Nginx con `docker compose -f docker-compose.prod.yml --env-file .env.production restart web`.

### 4. Mosquitto: usuarios, permisos y certificados

Usuarios (uno para el backend, que debe coincidir con `MQTT_USER`/`MQTT_PASSWORD`, y uno por PLC). El primero con `-c` crea el archivo:

```bash
docker run --rm -it -v "$PWD/docker/mosquitto/auth:/mosquitto/auth" eclipse-mosquitto:2.1-alpine mosquitto_passwd -c /mosquitto/auth/passwd backend
```

```bash
docker run --rm -it -v "$PWD/docker/mosquitto/auth:/mosquitto/auth" eclipse-mosquitto:2.1-alpine mosquitto_passwd /mosquitto/auth/passwd plc-demo-001
```

Permisos por topic: copia y edita el ejemplo.

```bash
cp docker/mosquitto/acl.example docker/mosquitto/auth/acl
```

Certificados TLS propios para el puerto 8883: coloca `server.crt` (cadena completa) y `server.key` en `docker/mosquitto/certs/`. Si los PLC verifican el servidor, deben confiar en la CA que firmó ese certificado. Mosquitto los exige aunque no uses el puerto 8883.

El contenedor corre con el usuario `1883` de la imagen, así que esos archivos deben ser legibles por él:

```bash
sudo chown -R 1883:1883 docker/mosquitto/auth docker/mosquitto/certs
```

```bash
sudo chmod 600 docker/mosquitto/auth/* docker/mosquitto/certs/server.key
```

### 5. Levantar

```bash
npm run prod:up
```

(equivale a `docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build`; no requiere Node en el servidor si usas el comando de Docker directamente).

Con `letsencrypt`, en el primer arranque Nginx sirve solo HTTP, certbot obtiene el certificado por el reto HTTP-01 y en menos de un minuto Nginx cambia solo a HTTPS. Las renovaciones son automáticas (certbot revisa cada 12 h y Nginx recarga cada 6 h). Para probar sin gastar el límite de emisiones de Let's Encrypt usa `CERTBOT_STAGING=true` y, al terminar, borra el volumen `automatizacion_letsencrypt` antes de volver a `false`. El servicio certbot acepta los términos de servicio de Let's Encrypt al emitir.

Crear los dispositivos en producción:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production exec backend node dist/scripts/seed.js
```

### Medidas de seguridad incluidas

- **Red:** solo se publican 80/443 y 1883/8883. MongoDB está en una red interna sin salida a internet; el backend solo es accesible a través de Nginx.
- **Contenedores:** sistema de archivos de solo lectura, `cap_drop: ALL` (solo se añaden las capacidades estrictamente necesarias), `no-new-privileges`, usuario no root en backend y Mosquitto, imágenes con versión fija, health checks, límites de memoria y rotación de logs.
- **Nginx:** CSP estricta (`script-src 'self'`), `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, sin versión en las cabeceras, rate limit en `/api` y tamaño máximo de body. Con HTTPS, además TLS 1.2/1.3 y HSTS (la cabecera HSTS nunca se envía sobre HTTP).
- **Backend:** helmet, CORS que solo acepta el mismo origen (frontend servido por Nginx) o `FRONTEND_URL`, rate limit en autenticación, validación de todas las entradas, variables de entorno validadas al arrancar, contraseñas con bcrypt, errores internos sin detalles hacia el cliente y apagado ordenado.
- **MongoDB:** autenticación obligatoria; el backend usa un usuario con permisos solo sobre su base (el root solo se usa para inicializar).
- **Mosquitto:** sin acceso anónimo, contraseñas con hash, ACL por usuario/topic y TLS en el puerto externo.
- **Secretos:** `.env.production`, usuarios y certificados de Mosquitto y certificados de Nginx están en `.gitignore` y fuera del contexto de build de las imágenes.
