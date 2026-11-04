import { io } from 'socket.io-client'
import { AUTH_TOKEN_KEY } from './config'

// Sin VITE_WS_URL se conecta al mismo origen que sirve el frontend (producción detrás de Nginx).
const url = import.meta.env.VITE_WS_URL || window.location.origin

const socket = io(url, {
  autoConnect: false,
  // Callback: el token se vuelve a leer en cada (re)conexión
  auth: (cb) => cb({ token: localStorage.getItem(AUTH_TOKEN_KEY) }),
})

export default socket
