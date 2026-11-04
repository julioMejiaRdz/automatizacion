import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { confirmAccount } from '@/api/AuthAPI'
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
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Confirmar cuenta</h2>
        <p className="mt-1 text-sm text-slate-300">
          Ingresa el código de 6 dígitos enviado a tu email
        </p>
      </div>

      <div className="space-y-5">
        <CodeInput
          value={token}
          onChange={setToken}
          onComplete={(code) => mutate({ token: code })}
          disabled={isPending}
        />
        <p className="text-center text-xs text-slate-300">
          La cuenta se confirmará automáticamente al completar el código
        </p>
      </div>

      <div className="mt-6 border-t border-slate-800 pt-6 text-center">
        <Link
          to="/auth/request-code"
          className="text-xs text-slate-400 transition-colors hover:text-teal-400"
        >
          ¿No recibiste el código? Solicitar uno nuevo
        </Link>
      </div>
    </>
  )
}
