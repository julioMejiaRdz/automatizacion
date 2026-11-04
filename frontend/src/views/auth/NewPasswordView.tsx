import { useState } from 'react'
import NewPasswordToken from '@/components/auth/NewPasswordToken'
import NewPasswordForm from '@/components/auth/NewPasswordForm'

export default function NewPasswordView() {
  const [token, setToken] = useState('')
  const [isValidToken, setIsValidToken] = useState(false)

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Restablecer contraseña</h2>
        <p className="mt-1 text-sm text-slate-300">
          {isValidToken
            ? 'Define tu nueva contraseña'
            : 'Ingresa el código de 6 dígitos que recibiste por email'}
        </p>
      </div>

      {isValidToken ? (
        <NewPasswordForm token={token} />
      ) : (
        <NewPasswordToken token={token} setToken={setToken} onValid={() => setIsValidToken(true)} />
      )}
    </>
  )
}
