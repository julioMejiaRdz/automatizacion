import type { Request } from 'express'
import type { CorsOptions, CorsOptionsDelegate } from 'cors'
import { env } from './env'

/** true si el Origin apunta al mismo host:puerto que recibió la petición. */
const isSameOrigin = (origin: string, host: string | undefined) => {
  try {
    return !!host && new URL(origin).host === host
  } catch {
    return false
  }
}

/**
 * Se permiten:
 * - Peticiones sin cabecera Origin (curl, Postman, health checks, GET del mismo origen).
 * - El origen configurado en FRONTEND_URL (desarrollo: Vite en otro puerto).
 * - Peticiones del mismo origen. En producción Nginx sirve el frontend y la API en el mismo
 *   host, así que la app funciona aunque se entre por la IP, el nombre interno o el dominio,
 *   sin tener que listarlos todos. Nginx reenvía el Host original (incluido el puerto).
 * Cualquier otro origen recibe 403.
 */
export const corsConfig: CorsOptionsDelegate<Request> = (req, callback) => {
  const origin = req.header('Origin')
  const allowed = !origin || origin === env.FRONTEND_URL || isSameOrigin(origin, req.header('Host'))

  if (allowed) {
    callback(null, { origin: true } satisfies CorsOptions)
  } else {
    callback(new Error('Origen no permitido por CORS'), { origin: false })
  }
}
