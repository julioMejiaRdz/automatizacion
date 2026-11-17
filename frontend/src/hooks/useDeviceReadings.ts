import { useEffect, useState } from 'react'
import { useSocket } from '@/context/SocketContext'
import type { DeviceReading } from '@/types/index'

type JoinResponse = { ok: true } | { ok: false; error: string }

/**
 * Se une a las rooms de los dispositivos indicados y devuelve la última lectura de cada uno
 * (indexada por deviceId). Vuelve a unirse automáticamente tras cada reconexión del socket.
 * - `seenAt`: cuándo se recibió la última lectura de cada dispositivo, en el reloj del navegador
 *   (se descuenta `ageMs` de la lectura inicial), para saber si sigue enviando datos.
 * - `mqttConnected`: si el backend está conectado al broker MQTT (`null` sin conexión al servidor).
 */
export function useDeviceReadings(deviceIds: string[]) {
  const socket = useSocket()
  const [readings, setReadings] = useState<Record<string, DeviceReading>>({})
  const [connected, setConnected] = useState(socket.connected)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [seenAt, setSeenAt] = useState<Record<string, number>>({})
  const [mqttConnected, setMqttConnected] = useState<boolean | null>(null)

  // Clave estable para no re-suscribirse si el arreglo cambia de referencia pero no de contenido
  const idsKey = deviceIds.join('|')

  useEffect(() => {
    const ids = idsKey ? idsKey.split('|') : []

    const join = () => {
      setConnected(true)
      socket.emit('get-mqtt-status', ({ connected }: { connected: boolean }) =>
        setMqttConnected(connected),
      )
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
    const onDisconnect = () => {
      setConnected(false)
      setMqttConnected(null)
    }
    const onReading = (reading: DeviceReading) => {
      setReadings((prev) => ({ ...prev, [reading.deviceId]: reading }))
      setSeenAt((prev) => ({ ...prev, [reading.deviceId]: Date.now() - (reading.ageMs ?? 0) }))
    }
    const onMqttStatus = ({ connected }: { connected: boolean }) => setMqttConnected(connected)

    socket.on('connect', join)
    socket.on('disconnect', onDisconnect)
    socket.on('device-reading', onReading)
    socket.on('mqtt-status', onMqttStatus)
    if (socket.connected) join()

    return () => {
      for (const id of ids) socket.emit('leave-device', id)
      socket.off('connect', join)
      socket.off('disconnect', onDisconnect)
      socket.off('device-reading', onReading)
      socket.off('mqtt-status', onMqttStatus)
    }
  }, [socket, idsKey])

  return { readings, seenAt, connected, mqttConnected, errors }
}
