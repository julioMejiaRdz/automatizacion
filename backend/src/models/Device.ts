import mongoose, { Schema, type InferSchemaType } from 'mongoose'

/**
 * Un dispositivo (PLC, sensor, medidor) que publica lecturas por MQTT.
 *
 * - `_id`: identificador del dispositivo (p. ej. su número de serie). Es el nombre de la room de Socket.IO.
 * - `topic`: topic MQTT exacto en el que publica (sin comodines `+` ni `#`).
 * - `fields`: variables que se muestran en el dashboard. `key` debe coincidir con la clave del payload
 *   (ver el formato en services/mqtt).
 */
const deviceFieldSchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    // Texto que se muestra en el dashboard; si se omite se usa `key`
    label: { type: String, trim: true },
    unit: { type: String, default: '', trim: true },
  },
  { _id: false },
)

const deviceSchema = new Schema(
  {
    _id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    topic: { type: String, required: true, unique: true, trim: true },
    fields: { type: [deviceFieldSchema], default: [] },
  },
  { timestamps: true },
)

export type IDevice = InferSchemaType<typeof deviceSchema>

const Device = mongoose.model('Device', deviceSchema)
export default Device
