import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import socket from '@/lib/socket'
import { AUTH_TOKEN_KEY } from '@/lib/config'

export const useLogout = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return () => {
    socket.disconnect()
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.setItem('show_farewell', '1')
    queryClient.clear()
    navigate('/auth/login')
  }
}
