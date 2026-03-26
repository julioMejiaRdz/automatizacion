import { socketAuth } from '../../middleware/socketAuth'
import { Server as SocketServer } from 'socket.io'
import { initMqtt } from '../mqtt'

export const webSocket = (server) => {
    const io = new SocketServer(server, { cors: { origin: process.env.FRONTEND_URL } })

    //Middleware
    io.use(socketAuth) 

    initMqtt(io)

    io.on('connect', socket => {
        console.log(`client connected: ${socket.id}`)

        // El cliente pide unirse al room de un dispositivo
        socket.on('join-device', (deviceId: string) => {
            socket.join(`device-${deviceId}`)
            console.log(`${socket.id} joined device-${deviceId}`)
        })

        socket.on('disconnect', () => {
            console.log(`client disconnected: ${socket.id}`)
        })
    })
}
