import jwt, { type SignOptions } from 'jsonwebtoken'
import type { Types } from 'mongoose'
import { env } from '../config/env'

export type UserPayload = {
  id: string
}

export const generateJWT = (id: Types.ObjectId | string) =>
  jwt.sign({ id: id.toString() } satisfies UserPayload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  })

/** Devuelve el payload si el token es válido, o null si no lo es. */
export const verifyJWT = (token: string): UserPayload | null => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)
    if (typeof decoded === 'object' && typeof decoded.id === 'string') {
      return { id: decoded.id }
    }
    return null
  } catch {
    return null
  }
}
