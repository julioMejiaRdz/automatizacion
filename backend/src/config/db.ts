import mongoose from 'mongoose'
import colors from 'colors'
import { env } from './env'

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(env.DATABASE_URL)
    console.log(colors.cyan.bold(`MongoDB conectado en: ${connection.host}:${connection.port}`))
  } catch (error) {
    console.error(colors.red.bold('Error al conectar a MongoDB:'), error)
    process.exit(1)
  }
}
