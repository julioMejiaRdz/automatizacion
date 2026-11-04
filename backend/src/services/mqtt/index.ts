import { connect, type MqttClient } from 'mqtt'
import colors from 'colors'
import { env } from '../../config/env'
import Device from '../../models/Device'

/**
 * Lectura normalizada que se reenvía al frontend.
 *
 * Formato esperado del payload MQTT (JSON plano, un topic por dispositivo):
 *   { "timestamp": "2026-01-01T12:00:00Z", "temperatura": 25.4, "presion": 1.2 }
 * `timestamp` es opcional (si falta se usa la hora de recepción) y el resto de
 * claves deben coincidir con `fields[].key` del dispositivo.
 */
export type ReadingValue = number | string | boolean | null

export type DeviceReading = {
  deviceId: string
  timestamp: string
  values: Record<string, ReadingValue>
}

type ReadingHandler = (reading: DeviceReading) => void

/** Cada cuánto se releen los dispositivos de MongoDB para ajustar las suscripciones */
const RESYNC_INTERVAL_MS = 30_000

let client: MqttClient | null = null
let resyncTimer: NodeJS.Timeout | null = null
let onReading: ReadingHandler = () => {}
/** topic → deviceId de los dispositivos registrados */
const topicToDevice = new Map<string, string>()
/** Topics a los que el cliente está suscrito actualmente */
const subscribed = new Set<string>()
/** Última lectura recibida por dispositivo, para enviarla al unirse a la room */
const lastReadings = new Map<string, DeviceReading>()

const isReadingValue = (value: unknown): value is ReadingValue =>
  value === null || ['number', 'string', 'boolean'].includes(typeof value)

/** Convierte el payload crudo en una lectura. Devuelve null si no es un objeto JSON. */
export function parsePayload(deviceId: string, raw: Buffer | string): DeviceReading | null {
  let data: unknown
  try {
    data = JSON.parse(raw.toString())
  } catch {
    return null
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return null

  const { timestamp, ...rest } = data as Record<string, unknown>
  const values: DeviceReading['values'] = {}
  for (const [key, value] of Object.entries(rest)) {
    if (isReadingValue(value)) values[key] = value
  }

  return {
    deviceId,
    timestamp: typeof timestamp === 'string' ? timestamp : new Date().toISOString(),
    values,
  }
}

/** Ajusta las suscripciones a los topics de los dispositivos guardados en MongoDB. */
export async function syncDeviceSubscriptions() {
  const devices = await Device.find().select('_id topic').lean()

  topicToDevice.clear()
  for (const device of devices) topicToDevice.set(device.topic, device._id)

  const deviceIds = new Set(topicToDevice.values())
  for (const id of lastReadings.keys()) {
    if (!deviceIds.has(id)) lastReadings.delete(id)
  }

  if (!client?.connected) return

  const toUnsubscribe = [...subscribed].filter((topic) => !topicToDevice.has(topic))
  const toSubscribe = [...topicToDevice.keys()].filter((topic) => !subscribed.has(topic))
  if (!toUnsubscribe.length && !toSubscribe.length) return

  if (toUnsubscribe.length) {
    await client.unsubscribeAsync(toUnsubscribe)
    for (const topic of toUnsubscribe) subscribed.delete(topic)
  }
  if (toSubscribe.length) {
    await client.subscribeAsync(toSubscribe)
    for (const topic of toSubscribe) subscribed.add(topic)
  }
  console.log(colors.cyan(`MQTT: suscrito a ${subscribed.size} topic(s)`))
}

export const getLastReading = (deviceId: string) => lastReadings.get(deviceId)

export function initMqtt(handler: ReadingHandler) {
  onReading = handler

  client = connect(env.MQTT_URL, {
    username: env.MQTT_USER,
    password: env.MQTT_PASSWORD,
    reconnectPeriod: 5000,
  })

  client.on('connect', async () => {
    console.log(colors.cyan.bold(`MQTT conectado a ${env.MQTT_URL}`))
    // Tras una (re)conexión el broker no conserva las suscripciones: se rehacen todas
    subscribed.clear()
    try {
      await syncDeviceSubscriptions()
    } catch (error) {
      console.error('MQTT: error al suscribirse a los topics:', error)
    }
  })

  client.on('message', (topic, message) => {
    const deviceId = topicToDevice.get(topic)
    if (!deviceId) return

    const reading = parsePayload(deviceId, message)
    if (!reading) {
      console.warn(`MQTT: payload inválido en ${topic}`)
      return
    }
    lastReadings.set(deviceId, reading)
    onReading(reading)
  })

  client.on('error', (error) => console.error('MQTT:', error.message))

  // Los cambios hechos por la API se aplican al instante; esta resincronización periódica cubre
  // los hechos desde otro proceso (npm run seed, cambios directos en MongoDB).
  resyncTimer = setInterval(() => {
    syncDeviceSubscriptions().catch((error) =>
      console.error('MQTT: error al resincronizar los topics:', error),
    )
  }, RESYNC_INTERVAL_MS)
}

export async function closeMqtt() {
  if (resyncTimer) clearInterval(resyncTimer)
  await client?.endAsync()
}
