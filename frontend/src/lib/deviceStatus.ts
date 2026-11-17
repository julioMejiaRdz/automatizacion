import { DEVICE_TIMEOUT_MS } from './config'

/**
 * Estado del enlace con un dispositivo:
 * - `online`: llegó una lectura dentro del tiempo límite.
 * - `stale`: hubo lecturas, pero ninguna dentro del tiempo límite (PLC caído, cable, red...).
 * - `waiting`: todavía no se ha recibido ninguna lectura.
 */
export type DeviceStatus = 'online' | 'stale' | 'waiting'

/** `seenAt`: momento (reloj del navegador) en que se recibió la última lectura. */
export function getDeviceStatus(
  seenAt: number | undefined,
  now: number,
  timeoutMs = DEVICE_TIMEOUT_MS,
): DeviceStatus {
  if (seenAt === undefined) return 'waiting'
  return now - seenAt <= timeoutMs ? 'online' : 'stale'
}

const relativeTime = new Intl.RelativeTimeFormat('es', { style: 'short' })

/** "hace 12 s", "hace 3 min", "hace 2 h", "hace 1 d". */
export function formatElapsed(ms: number) {
  const seconds = Math.max(0, Math.round(ms / 1000))
  if (seconds < 60) return relativeTime.format(-seconds, 'second')
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return relativeTime.format(-minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (hours < 24) return relativeTime.format(-hours, 'hour')
  return relativeTime.format(-Math.round(hours / 24), 'day')
}
