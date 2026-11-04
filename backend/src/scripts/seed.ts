/**
 * Crea o actualiza los dispositivos de DEVICES. Uso: npm run seed
 * Reemplaza el ejemplo por los dispositivos reales de tu proyecto.
 */
import mongoose from 'mongoose'
import { connectDB } from '../config/db'
import Device from '../models/Device'

const DEVICES = [
  {
    _id: 'demo-001',
    name: 'Dispositivo de ejemplo',
    topic: 'planta/demo-001',
    fields: [
      { key: 'temperatura', label: 'Temperatura', unit: '°C' },
      { key: 'presion', label: 'Presión', unit: 'bar' },
      { key: 'flujo', label: 'Flujo volumétrico', unit: 'm³/h' },
      { key: 'en_marcha', label: 'En marcha', unit: '' },
    ],
  },
]

async function seed() {
  await connectDB()
  for (const device of DEVICES) {
    await Device.findByIdAndUpdate(device._id, device, { upsert: true, runValidators: true })
    console.log(`Dispositivo ${device._id} listo (topic: ${device.topic})`)
  }
  await mongoose.disconnect()
}

void seed()
