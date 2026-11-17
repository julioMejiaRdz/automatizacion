import axios from 'axios'
import { AUTH_TOKEN_KEY } from './config'
import { expireSession } from './session'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 401 en una petición que llevaba token: la sesión venció o el usuario ya no existe → al login.
// Los errores de negocio con sesión válida usan otros códigos (400, 403, 404...).
api.interceptors.response.use(undefined, (error: unknown) => {
  if (
    axios.isAxiosError(error) &&
    error.response?.status === 401 &&
    error.config?.headers?.Authorization
  ) {
    expireSession()
  }
  return Promise.reject(error)
})

export default api
