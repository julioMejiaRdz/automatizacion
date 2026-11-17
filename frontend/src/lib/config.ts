// Personalización por proyecto. Todo se define en frontend/.env.local (o como build args en producción).

/** Nombre visible de la aplicación (login, sidebar, título de la pestaña). */
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Base para proyectos de automatización'

/** Descripción corta bajo el nombre en el login. */
export const APP_DESCRIPTION = import.meta.env.VITE_APP_DESCRIPTION || 'Monitoreo en tiempo real'

/**
 * Ruta del logo del cliente dentro de frontend/public (p. ej. "/logo.svg").
 * Vacío: se muestra un icono genérico.
 */
export const APP_LOGO = normalizeLogoPath(import.meta.env.VITE_APP_LOGO || '')

/**
 * Color de marca: cualquier color CSS válido (#185fa5, rgb(...), oklch(...)).
 * En el .env los hex deben ir entre comillas ("#185fa5"): sin comillas el # inicia un comentario.
 * También se acepta el hex sin # (185fa5).
 */
export const BRAND_COLOR = normalizeColor(import.meta.env.VITE_BRAND_COLOR || '')

/** Texto del pie del login. `{year}` se reemplaza por el año actual. Vacío: sin pie. */
export const FOOTER_TEXT = (import.meta.env.VITE_FOOTER_TEXT || '').replace(
  '{year}',
  String(new Date().getFullYear()),
)

/** "logo.png" → "/logo.png": sin la barra inicial el navegador lo buscaría relativo a la ruta actual. */
function normalizeLogoPath(value: string) {
  const path = value.trim()
  if (!path || /^(\/|https?:|data:)/.test(path)) return path
  return `/${path}`
}

function normalizeColor(value: string) {
  const color = value.trim()
  return /^([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color) ? `#${color}` : color
}

/** Clave de localStorage donde se guarda el JWT. */
export const AUTH_TOKEN_KEY = 'AUTH_TOKEN'
