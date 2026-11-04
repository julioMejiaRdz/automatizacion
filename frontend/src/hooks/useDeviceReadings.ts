import { useEffect, useState } from 'react'
import { useSocket } from '@/context/SocketContext'
import type { DeviceReading } from '@/types/index'

type JoinResponse = { ok: true } | { ok: false; error: string }

/**
 * Se une a las rooms de los dispositivos indicados y devuelve la última lectura de cada uno
 * (indexada por deviceId). Vuelve a unirse automáticamente tras cada reconexión del socket.
 */
export function useDeviceReadings(deviceIds: string[]) {
  const socket = useSocket()
  const [readings, setReadings] = useState<Record<string, DeviceReading>>({})
  const [connected, setConnected] = useState(socket.connected)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Clave estable para no re-suscribirse si el arreglo cambia de referencia pero no de contenido
  const idsKey = deviceIds.join('|')

  useEffect(() => {
    const ids = idsKey ? idsKey.split('|') : []

    const join = () => {
      setConnected(true)
      for (const id of ids) {
        socket.emit('join-device', id, (res: JoinResponse) => {
          setErrors((prev) => {
            const next = { ...prev }
            if (res.ok) delete next[id]
            else next[id] = res.error
            return next
          })
        })
      }
    }
    const onDisconnect = () => setConnected(false)
    const onReading = (reading: DeviceReading) =>
      setReadings((prev) => ({ ...prev, [reading.deviceId]: reading }))

    socket.on('connect', join)
    socket.on('disconnect', onDisconnect)
    socket.on('device-reading', onReading)
    if (socket.connected) join()

    return () => {
      for (const id of ids) socket.emit('leave-device', id)
      socket.off('connect', join)
      socket.off('disconnect', onDisconnect)
      socket.off('device-reading', onReading)
    }
  }, [socket, idsKey])

  return { readings, connected, errors }
}
