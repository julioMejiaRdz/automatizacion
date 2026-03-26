import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { corsConfig } from './config/cors'
import { connectDB } from './config/db'
import { webSocket } from './services/websocket/index'
import authRoutes from './routes/authRoutes'
import morgan from 'morgan'

dotenv.config()

connectDB()

const app = express()

app.use(cors(corsConfig))

app.use(morgan('dev'))

app.use(express.json())

app.use('/api/auth', authRoutes)

const server = http.createServer(app)

webSocket(server)

export default server