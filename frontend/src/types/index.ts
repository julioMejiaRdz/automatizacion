import { z } from 'zod'

/** Auth & usuarios */

export const authSchema = z.object({
  name: z.string(),
  email: z.email(),
  current_password: z.string(),
  password: z.string(),
  password_confirmation: z.string(),
  token: z.string(),
})

export type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, 'email' | 'password'>
export type UserRegistrationForm = Pick<
  Auth,
  'name' | 'email' | 'password' | 'password_confirmation'
>
export type ConfirmToken = Pick<Auth, 'token'>
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>
export type ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>
export type UpdateCurrentUserPasswordForm = Pick<
  Auth,
  'current_password' | 'password' | 'password_confirmation'
>
export type CheckPasswordForm = Pick<Auth, 'password'>

export const userSchema = authSchema.pick({ name: true, email: true }).extend({ _id: z.string() })

export type User = z.infer<typeof userSchema>
export type UserProfileForm = Pick<User, 'name' | 'email'>

/** Dispositivos */

export const deviceFieldSchema = z.object({
  key: z.string(),
  label: z.string().optional(),
  unit: z.string().default(''),
})

export const deviceSchema = z.object({
  _id: z.string(),
  name: z.string(),
  topic: z.string(),
  fields: z.array(deviceFieldSchema),
})

export type DeviceField = z.infer<typeof deviceFieldSchema>
export type Device = z.infer<typeof deviceSchema>

/** Evento `device-reading` que emite el backend por Socket.IO */
export type ReadingValue = number | string | boolean | null

export type DeviceReading = {
  deviceId: string
  timestamp: string
  values: Record<string, ReadingValue>
}
