import { io } from "socket.io-client"

const socket = io(import.meta.env.VITE_WS_URL, {
  autoConnect: false,
  auth: (cb: (data: object) => void) => cb({ token: localStorage.getItem('AUTH_TOKEN') })
})

export default socket
