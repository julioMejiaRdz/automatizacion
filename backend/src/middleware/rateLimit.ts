import { rateLimit } from 'express-rate-limit'

/** Limita intentos en rutas sensibles de autenticación (login, registro, códigos). */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Demasiados intentos, intenta de nuevo en unos minutos' },
})
