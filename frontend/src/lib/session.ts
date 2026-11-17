import { AUTH_TOKEN_KEY } from './config'

/** Marca en localStorage para avisar en el login que la sesión expiró. */
export const SESSION_EXPIRED_KEY = 'session_expired'

/**
 * Cierra una sesión vencida o inválida (el backend respondió 401 o rechazó el socket) y lleva al
 * login con recarga completa, así se limpian la caché de React Query y el socket. No hace nada si
 * ya se está en las vistas de autenticación (ahí un 401 es, p. ej., una contraseña incorrecta).
 */
export function expireSession() {
  if (window.location.pathname.startsWith('/auth/')) return
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.setItem(SESSION_EXPIRED_KEY, '1')
  window.location.replace('/auth/login')
}
