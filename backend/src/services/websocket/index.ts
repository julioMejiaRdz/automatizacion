import type { Server as HttpServer } from 'node:http'
import { Server as SocketServer } from 'socket.io'
import { env } from '../../config/env'
import { socketAuth } from '../../middleware/socketAuth'
import Device from '../../models/Device'
import { getLastReading, type DeviceReading } from '../mqtt'

/**
 * Eventos de Socket.IO:
 * - cliente → servidor `join-device` (deviceId, ack): se une a la room `device-{id}`.
 *   El ack recibe `{ ok: true }` o `{ ok: false, error }`, y luego se envía la última lectura conocida.
 * - cliente → servidor `leave-device` (deviceId): sale de la room.
 * - servidor → cliente `device-reading` (DeviceReading): nueva lectura del dispositivo.
 */
type JoinAck = (response: { ok: true } | { ok: false; error: string }) => void

export const deviceRoom = (deviceId: string) => `device-${deviceId}`

export function initWebSocket(server: HttpServer) {
  const io = new SocketServer(server, { cors: { origin: env.FRONTEND_URL } })

  io.use(socketAuth)

  io.on('connection', (socket) => {
    socket.on('join-device', async (deviceId: unknown, ack?: JoinAck) => {
      const reply: JoinAck = typeof ack === 'function' ? ack : () => {}
      if (typeof deviceId !== 'string') return reply({ ok: false, error: 'ID no válido' })

      try {
        const exists = await Device.exists({ _id: deviceId })
        if (!exists) return reply({ ok: false, error: 'Dispositivo no encontrado' })
      } catch {
        return reply({ ok: false, error: 'Error al buscar el dispositivo' })
      }

      await socket.join(deviceRoom(deviceId))
      reply({ ok: true })

      const last = getLastReading(deviceId)
      if (last) socket.emit('device-reading', last)
    })

    socket.on('leave-device', async (deviceId: unknown) => {
      if (typeof deviceId === 'string') await socket.leave(deviceRoom(deviceId))
    })
  })

  const emitReading = (reading: DeviceReading) => {
    io.to(deviceRoom(reading.deviceId)).emit('device-reading', reading)
  }

  return { io, emitReading }
}
