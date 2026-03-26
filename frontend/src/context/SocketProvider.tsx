import socket from "@/lib/socket"
import { type ReactNode, useEffect } from "react"
import { SocketContext } from "./SocketContext"

type SocketProviderProps = {
    children: ReactNode
}

export function SocketProvider({ children }: SocketProviderProps) {
  useEffect(() => {
    socket.connect()
    return () => { socket.disconnect() }
  }, [])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}
