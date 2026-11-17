import { useState } from 'react'
import { AuthHeader } from '@/components/auth/AuthForm'
import NewPasswordToken from '@/components/auth/NewPasswordToken'
import NewPasswordForm from '@/components/auth/NewPasswordForm'

export default function NewPasswordView() {
  const [token, setToken] = useState('')
  const [isValidToken, setIsValidToken] = useState(false)

  return (
    <>
      <AuthHeader
        title="Restablecer contraseña"
        description={
          isValidToken
            ? 'Define tu nueva contraseña'
            : 'Ingresa el código de 6 dígitos que recibiste por email'
        }
      />

      {isValidToken ? (
        <NewPasswordForm token={token} />
      ) : (
        <NewPasswordToken token={token} setToken={setToken} onValid={() => setIsValidToken(true)} />
      )}
    </>
  )
}
