# Automatización — Plantilla IoT MQTT + WebSocket

Plantilla base para proyectos de automatización en tiempo real.

---

## Stack

| Capa | Tecnología |
|---|---|
| Broker | Mosquitto (MQTT) |
| Backend | Node.js · Express · Socket.IO · Mongoose |
| Frontend | React · TypeScript · Vite · Tailwind CSS |
| Base de datos | MongoDB |
| Autenticación | JWT |

---

## Arquitectura

```
Dispositivos PLC
      │  MQTT (pub)
      ▼
 Broker Mosquitto
      │  mqtt://
      ▼
 Backend (Node.js)
  ├── Express REST API  ──►  /api/auth
  ├── MQTT Service       ──►  suscribe a topics
  └── Socket.IO Server   ──►  emite a rooms por dispositivo
      │  ws://
      ▼
 Frontend (React)
  ├── SocketContext      ──►  conexión global autenticada
  └── DashboardView      ──►  join-device · mqtt-message (legacy)
```

**Flujo de datos:**
1. El dispositivo PLC publica lecturas al broker Mosquitto vía MQTT
2. El backend está suscrito al topic del dispositivo y recibe el mensaje
3. El backend emite el payload a la room `device-{id}` via Socket.IO
4. El frontend (autenticado con JWT) está unido a esa room y recibe el evento en tiempo real

---

## Estructura del proyecto

```
websockets/
├── backend/
│   ├── src/
│   │   ├── config/         # Conexión MongoDB
│   │   ├── controllers/    # AuthController
│   │   ├── middleware/      # auth.ts · socketAuth.ts
│   │   ├── models/         # User · Token · Device
│   │   ├── routes/         # authRoutes
│   │   ├── services/
│   │   │   ├── mqtt/       # Conexión al broker y suscripción
│   │   │   └── websocket/  # Socket.IO server + rooms
│   │   ├── utils/          # jwt.ts
│   │   ├── server.ts
│   │   └── index.ts
│   ├── .env                # Variables de entorno (no se versiona)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/            # AuthAPI
│   │   ├── components/     # NavMenu · Logo · ErrorMessage · ui/
│   │   ├── context/        # SocketContext · SocketProvider
│   │   ├── hooks/          # useAuth
│   │   ├── layouts/        # AppLayout · AuthLayout
│   │   ├── lib/            # socket.ts · utils.ts
│   │   ├── router.tsx
│   │   ├── views/
│   │   │   ├── auth/       # Login · Register · ConfirmAccount · etc.
│   │   │   └── DashboardView.tsx
│   │   └── main.tsx
│   ├── .env.local          # Variables de entorno (no se versiona)
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Instalación

### Requisitos previos

- Node.js >= 18
- MongoDB corriendo localmente o URI remota
- Broker Mosquitto instalado y activo

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd websockets
```

### 2. Configurar variables de entorno

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

Edita ambos archivos con tus valores. Ver sección [Variables de entorno](#variables-de-entorno).

### 3. Instalar dependencias

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 4. Iniciar en desarrollo

```bash
# Backend (desde /backend)
npm run dev

# Frontend (desde /frontend)
npm run dev
```

El backend corre en `http://localhost:3000` y el frontend en `http://localhost:5173`.

---

## Variables de entorno

### `backend/.env`

```env
# Base de datos
DATABASE_URL=mongodb://localhost:27017/nombre_db

# Servidor
PORT=3000
FRONTEND_URL=http://localhost:5173

# MQTT — Broker Mosquitto
MQTT_HOST=mqtt://IP_DEL_BROKER
MQTT_USER=usuario_mqtt
MQTT_PASSWORD=password_mqtt

# JWT
JWT_SECRET=cambia_esto_por_una_cadena_segura
```

### `frontend/.env.local`

```env
# URL de la API REST del backend
VITE_API_URL=http://localhost:3000/api

# URL del servidor WebSocket
VITE_WS_URL=http://localhost:3000
```

---

