import { useSyncExternalStore } from 'react'

// El tema es la clase `dark` en <html> (ver themeInitPlugin en vite.config.ts y AnimatedThemeToggler).
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

const getSnapshot = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')

/** Devuelve 'dark' o 'light' y se actualiza cuando cambia el tema. */
export const useTheme = () => useSyncExternalStore(subscribe, getSnapshot)
