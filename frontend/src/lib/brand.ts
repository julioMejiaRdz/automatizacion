import { BRAND_COLOR } from './config'

/**
 * Aplica VITE_BRAND_COLOR como variable --brand en <html>. Todo el tema (botones, foco,
 * sidebar, panel del login) se deriva de esa variable en index.css.
 * Si el valor no es un color CSS válido se mantiene el azul por defecto.
 * Elige un color lo bastante oscuro para que el texto blanco encima sea legible.
 */
export function applyBrandColor() {
  if (!BRAND_COLOR) return
  if (!CSS.supports('color', BRAND_COLOR)) {
    console.warn(`VITE_BRAND_COLOR no es un color válido: "${BRAND_COLOR}"`)
    return
  }
  document.documentElement.style.setProperty('--brand', BRAND_COLOR)
}
