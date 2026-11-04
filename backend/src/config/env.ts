import dotenv from 'dotenv'
import { z } from 'zod'

// Carga backend/.env si existe. En Docker las variables llegan desde docker-compose.
dotenv.config({ quiet: true })

const optional = z
  .string()
  .optional()
  .transform((value) => (value ? value : undefined))

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  FRONTEND_URL: z.url(),
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),

  DATABASE_URL: z.string().startsWith('mongodb', 'Debe ser una URI de MongoDB'),

  JWT_SECRET: z.string().min(32, 'Debe tener al menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('1d'),

  MQTT_URL: z
    .string()
    .regex(/^(mqtts?|wss?):\/\//, 'Debe empezar con mqtt://, mqtts://, ws:// o wss://'),
  MQTT_USER: optional,
  MQTT_PASSWORD: optional,

  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_SECURE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  SMTP_USER: optional,
  SMTP_PASSWORD: optional,
  MAIL_FROM: z.string().min(1),
})

export type Env = z.infer<typeof envSchema>

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Variables de entorno inválidas o faltantes:')
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
  }
  process.exit(1)
}

export const env: Env = parsed.data
export const isProduction = env.NODE_ENV === 'production'
