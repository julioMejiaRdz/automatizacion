import api from '@/lib/axios'
import { AUTH_TOKEN_KEY } from '@/lib/config'
import { toApiError } from './errors'
import {
  userSchema,
  type CheckPasswordForm,
  type ConfirmToken,
  type ForgotPasswordForm,
  type NewPasswordForm,
  type RequestConfirmationCodeForm,
  type UpdateCurrentUserPasswordForm,
  type UserLoginForm,
  type UserProfileForm,
  type UserRegistrationForm,
} from '@/types/index'

/** POST que devuelve el mensaje de texto del backend o lanza un Error con su mensaje. */
const postMessage = async (url: string, body: unknown) => {
  try {
    const { data } = await api.post<string>(url, body)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}

export const createAccount = (formData: UserRegistrationForm) =>
  postMessage('/auth/create-account', formData)

export const confirmAccount = (formData: ConfirmToken) =>
  postMessage('/auth/confirm-account', formData)

export const requestConfirmationCode = (formData: RequestConfirmationCodeForm) =>
  postMessage('/auth/request-code', formData)

export const forgotPassword = (formData: ForgotPasswordForm) =>
  postMessage('/auth/forgot-password', formData)

export const validateToken = (formData: ConfirmToken) =>
  postMessage('/auth/validate-token', formData)

export const updatePasswordWithToken = ({
  formData,
  token,
}: {
  formData: NewPasswordForm
  token: ConfirmToken['token']
}) => postMessage(`/auth/update-password/${token}`, formData)

export const checkPassword = (formData: CheckPasswordForm) =>
  postMessage('/auth/check-password', formData)

export const updateCurrentUserPassword = (formData: UpdateCurrentUserPasswordForm) =>
  postMessage('/auth/update-password', formData)

export async function login(formData: UserLoginForm) {
  const token = await postMessage('/auth/login', formData)
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  return token
}

export async function getUser() {
  try {
    const { data } = await api.get('/auth/user')
    return userSchema.parse(data)
  } catch (error) {
    throw toApiError(error)
  }
}

export async function updateProfile(formData: UserProfileForm) {
  try {
    const { data } = await api.put<string>('/auth/profile', formData)
    return data
  } catch (error) {
    throw toApiError(error)
  }
}
