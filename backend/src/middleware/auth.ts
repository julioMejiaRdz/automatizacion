import type { Request, Response, NextFunction } from 'express'
import User, { type UserDocument } from '../models/User'
import { verifyJWT } from '../utils/jwt'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: UserDocument
    }
  }
}

/** Exige un JWT válido en `Authorization: Bearer <token>` y carga el usuario en `req.user`. */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const [scheme, token] = req.headers.authorization?.split(' ') ?? []
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  const payload = verifyJWT(token)
  if (!payload) {
    return res.status(401).json({ error: 'Token no válido' })
  }

  try {
    const user = await User.findById(payload.id).select('_id name email')
    if (!user) {
      return res.status(401).json({ error: 'Token no válido' })
    }
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

/** Para controladores detrás de `authenticate`: devuelve el usuario ya cargado. */
export const getAuthUser = (req: Request): UserDocument => {
  if (!req.user) throw new Error('authenticate no se ejecutó antes de este controlador')
  return req.user
}
