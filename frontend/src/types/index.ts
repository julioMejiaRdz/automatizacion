import { z } from 'zod'

/** Auth & Users */

export const authSchema = z.object({
    name: z.string(),
    email: z.email(),
    current_password: z.string(),
    password: z.string(),
    password_confirmation: z.string(),
    token: z.string()
})

export type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, 'email' | 'password' >
export type UserRegistrationForm = Pick<Auth, 'name'| 'email' | 'password' | 'password_confirmation'>
export type ConfirmToken = Pick<Auth, 'token'>
export type RequestConfirmationCodeForm = Pick<Auth,'email'>
export type  ForgotPasswordForm = Pick<Auth, 'email'>
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>
export type UpdateCurrentUserPasswordForm = Pick<Auth, 'password' | 'password_confirmation' | 'current_password'>
export type CheckPasswordForm = Pick<Auth, 'password'>

/** Users */
export const userSchema = authSchema.pick({
    name: true,
    email: true
}).extend({
    _id: z.string()
})

export type User = z.infer<typeof userSchema>
export type UserProfileForm = Pick<User, 'email' | 'name'>

export interface DeviceValues {
  "velocidad de flujo": number;
  "flujo volumetrico": number;
  "flujo masico": number;
  "temperatura de bobina": number;
  "conductividad": number;
  "tiempo de operacion": number;
  "totalizador": number;
}

export interface SensorEvent {
  topic: string;
  data: {
    "fecha y hora": string;
    [deviceId: string]: DeviceValues | string;
  };
}