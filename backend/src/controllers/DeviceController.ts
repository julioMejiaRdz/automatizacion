import type { Request, Response } from 'express'
import Device from '../models/Device'
import { syncDeviceSubscriptions } from '../services/mqtt'

// Cada alta, cambio o baja vuelve a sincronizar las suscripciones MQTT.

export class DeviceController {
  static getAll = async (_req: Request, res: Response) => {
    const devices = await Device.find().sort({ name: 1 })
    res.json(devices)
  }

  static getById = async (req: Request, res: Response) => {
    const device = await Device.findById(req.params.id)
    if (!device) return res.status(404).json({ error: 'Dispositivo no encontrado' })
    res.json(device)
  }

  static create = async (req: Request, res: Response) => {
    const { id, name, topic, fields } = req.body

    const exists = await Device.exists({ $or: [{ _id: id }, { topic }] })
    if (exists) {
      return res.status(409).json({ error: 'Ya existe un dispositivo con ese ID o topic' })
    }

    const device = await Device.create({ _id: id, name, topic, fields })
    await syncDeviceSubscriptions()
    res.status(201).json(device)
  }

  static update = async (req: Request, res: Response) => {
    const { name, topic, fields } = req.body

    const topicTaken = await Device.exists({ topic, _id: { $ne: req.params.id } })
    if (topicTaken) {
      return res.status(409).json({ error: 'Otro dispositivo ya usa ese topic' })
    }

    const device = await Device.findByIdAndUpdate(
      req.params.id,
      { name, topic, fields },
      { returnDocument: 'after', runValidators: true },
    )
    if (!device) return res.status(404).json({ error: 'Dispositivo no encontrado' })

    await syncDeviceSubscriptions()
    res.json(device)
  }

  static remove = async (req: Request, res: Response) => {
    const device = await Device.findByIdAndDelete(req.params.id)
    if (!device) return res.status(404).json({ error: 'Dispositivo no encontrado' })

    await syncDeviceSubscriptions()
    res.send('Dispositivo eliminado')
  }
}
