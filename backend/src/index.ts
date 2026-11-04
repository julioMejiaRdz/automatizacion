import http from 'node:http'
import mongoose from 'mongoose'
import colors from 'colors'
import { env } from './config/env'
import { connectDB } from './config/db'
import { createApp } from './server'
import { initWebSocket } from './services/websocket'
import { closeMqtt, initMqtt } from './services/mqtt'

async function main() {
  await connectDB()

  const server = http.createServer(createApp())
  const { io, emitReading } = initWebSocket(server)
  initMqtt(emitReading)

  server.listen(env.PORT, () => {
    console.log(colors.cyan.bold(`API REST y Socket.IO en el puerto ${env.PORT}`))
  })

  // Apagado ordenado (docker stop envía SIGTERM)
  const shutdown = async (signal: string) => {
    console.log(`${signal} recibido, cerrando...`)
    await io.close()
    await closeMqtt()
    await mongoose.disconnect()
    process.exit(0)
  }
  process.on('SIGTERM', () => void shutdown('SIGTERM'))
  process.on('SIGINT', () => void shutdown('SIGINT'))
}

void main()
