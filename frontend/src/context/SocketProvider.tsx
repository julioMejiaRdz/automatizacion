import socket from '@/lib/socket'
import { expireSession } from '@/lib/session'
import { type ReactNode, useEffect } from 'react'
import { SocketContext } from './SocketContext'

type SocketProviderProps = {
  children: ReactNode
}

export function SocketProvider({ children }: SocketProviderProps) {
  useEffect(() => {
    // El backend rechaza el socket con estos mensajes si el token venció o no es válido
    const onConnectError = (error: Error) => {
      if (['No autorizado', 'Token no válido'].includes(error.message)) expireSession()
    }
    socket.on('connect_error', onConnectError)
    socket.connect()
    return () => {
      socket.off('connect_error', onConnectError)
      socket.disconnect()
    }
  }, [])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}
