import type { Socket } from 'socket.io'
import User from '../models/User'
import { verifyJWT } from '../utils/jwt'

/** Valida el JWT enviado en `auth.token` al conectar el socket y guarda el usuario en `socket.data.user`. */
export const socketAuth = async (socket: Socket, next: (err?: Error) => void) => {
  const token: unknown = socket.handshake.auth.token
  if (typeof token !== 'string' || !token) return next(new Error('No autorizado'))

  const payload = verifyJWT(token)
  if (!payload) return next(new Error('Token no válido'))

  try {
    const user = await User.exists({ _id: payload.id })
    if (!user) return next(new Error('Token no válido'))
    socket.data.user = { id: payload.id }
    next()
  } catch {
    next(new Error('Error al validar el token'))
  }
}
