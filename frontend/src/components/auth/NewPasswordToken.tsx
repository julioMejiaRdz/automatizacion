import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { validateToken } from '@/api/AuthAPI'
import { AuthFooter, AuthLink } from '@/components/auth/AuthForm'
import CodeInput from '@/components/auth/CodeInput'

type NewPasswordTokenProps = {
  token: string
  setToken: (token: string) => void
  onValid: () => void
}

export default function NewPasswordToken({ token, setToken, onValid }: NewPasswordTokenProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: validateToken,
    onError: (error) => {
      toast.error(error.message)
      setToken('')
    },
    onSuccess: (message) => {
      toast.success(message)
      onValid()
    },
  })

  return (
    <>
      <CodeInput
        value={token}
        onChange={setToken}
        onComplete={(code) => mutate({ token: code })}
        disabled={isPending}
      />
      <AuthFooter>
        <span>
          ¿No recibiste el código?{' '}
          <AuthLink to="/auth/forgot-password">Solicita uno nuevo</AuthLink>
        </span>
      </AuthFooter>
    </>
  )
}
