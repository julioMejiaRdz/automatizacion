import { isAxiosError } from 'axios'

type ApiErrorBody = {
  error?: string
  errors?: { msg: string }[]
}

/**
 * Convierte cualquier error de una petición en un Error con un mensaje legible.
 * El backend responde `{ error }` en errores de negocio y `{ errors: [{ msg }] }` en validaciones.
 */
export function toApiError(error: unknown): Error {
  if (isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data
    if (body?.error) return new Error(body.error)
    if (body?.errors?.length) return new Error(body.errors.map((e) => e.msg).join('. '))
    if (!error.response) return new Error('No se pudo conectar con el servidor')
  }
  return new Error('Hubo un error inesperado')
}
