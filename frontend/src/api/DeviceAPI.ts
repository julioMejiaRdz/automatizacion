import { z } from 'zod'
import api from '@/lib/axios'
import { deviceSchema } from '@/types/index'
import { toApiError } from './errors'

export async function getDevices() {
  try {
    const { data } = await api.get('/devices')
    return z.array(deviceSchema).parse(data)
  } catch (error) {
    throw toApiError(error)
  }
}
