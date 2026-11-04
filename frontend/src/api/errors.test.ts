import { describe, expect, it } from 'vitest'
import { AxiosError, type AxiosResponse } from 'axios'
import { toApiError } from './errors'

const axiosErrorWith = (data: unknown) =>
  new AxiosError('fail', 'ERR', undefined, undefined, { data, status: 400 } as AxiosResponse)

describe('toApiError', () => {
  it('usa el campo error del backend', () => {
    expect(toApiError(axiosErrorWith({ error: 'Contraseña incorrecta' })).message).toBe(
      'Contraseña incorrecta',
    )
  })

  it('une los mensajes de validación', () => {
    const error = axiosErrorWith({ errors: [{ msg: 'E-mail no válido' }, { msg: 'Falta nombre' }] })
    expect(toApiError(error).message).toBe('E-mail no válido. Falta nombre')
  })

  it('indica cuando no hay conexión con el servidor', () => {
    expect(toApiError(new AxiosError('Network Error')).message).toBe(
      'No se pudo conectar con el servidor',
    )
  })
})
