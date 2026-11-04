import { useSyncExternalStore } from 'react'

// Usado por el sidebar de shadcn/ui. Reescrito con useSyncExternalStore para no llamar
// setState dentro de un efecto (regla react-hooks/set-state-in-effect).
const MOBILE_BREAKPOINT = 768
const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(query)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

const getSnapshot = () => window.matchMedia(query).matches

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot)
}
