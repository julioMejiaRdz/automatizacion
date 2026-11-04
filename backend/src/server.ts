import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env, isProduction } from './config/env'
import { corsConfig } from './config/cors'
import { errorHandler, notFound } from './middleware/errorHandler'
import authRoutes from './routes/authRoutes'
import deviceRoutes from './routes/deviceRoutes'

/** Crea la app de Express sin conectar a MongoDB ni abrir el puerto (así se puede testear). */
export function createApp() {
  const app = express()

  // Detrás de Nginx: permite que el rate limit vea la IP real del cliente
  app.set('trust proxy', env.TRUST_PROXY)

  app.use(helmet())
  app.use(cors(corsConfig))
  if (env.NODE_ENV !== 'test') app.use(morgan(isProduction ? 'combined' : 'dev'))
  app.use(express.json({ limit: '100kb' }))

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' })
  })
  app.use('/api/auth', authRoutes)
  app.use('/api/devices', deviceRoutes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
