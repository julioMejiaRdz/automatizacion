import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { confirmAccount } from '@/api/AuthAPI'
import { AuthFooter, AuthHeader, AuthLink } from '@/components/auth/AuthForm'
import CodeInput from '@/components/auth/CodeInput'

export default function ConfirmAccountView() {
  const [token, setToken] = useState('')
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    mutationFn: confirmAccount,
    onError: (error) => {
      toast.error(error.message)
      setToken('')
    },
    onSuccess: (message) => {
      toast.success(message)
      navigate('/auth/login')
    },
  })

  return (
    <>
      <AuthHeader
        title="Confirmar cuenta"
        description="Ingresa el código de 6 dígitos que enviamos a tu email"
      />

      <CodeInput
        value={token}
        onChange={setToken}
        onComplete={(code) => mutate({ token: code })}
        disabled={isPending}
      />
      <p className="mt-4 text-center text-xs text-muted-foreground">
        La cuenta se confirma automáticamente al completar el código
      </p>

      <AuthFooter>
        <span>
          ¿No recibiste el código? <AuthLink to="/auth/request-code">Solicita uno nuevo</AuthLink>
        </span>
      </AuthFooter>
    </>
  )
}
