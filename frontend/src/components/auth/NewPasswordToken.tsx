import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { validateToken } from '@/api/AuthAPI'
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
      <div className="space-y-5">
        <CodeInput
          value={token}
          onChange={setToken}
          onComplete={(code) => mutate({ token: code })}
          disabled={isPending}
        />
      </div>
      <div className="mt-6 border-t border-slate-800 pt-6 text-center">
        <Link
          to="/auth/forgot-password"
          className="text-xs text-slate-400 transition-colors hover:text-teal-400"
        >
          Solicitar un nuevo código
        </Link>
      </div>
    </>
  )
}
