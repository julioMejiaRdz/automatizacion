import {
  authButtonClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
} from '@/components/auth/styles'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import type { RequestConfirmationCodeForm } from '../../types'
import ErrorMessage from '@/components/ErrorMessage'
import { requestConfirmationCode } from '@/api/AuthAPI'
import { toast } from 'react-toastify'

export default function RequestNewCodeView() {
  const initialValues: RequestConfirmationCodeForm = { email: '' }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues })

  const { mutate, isPending } = useMutation({
    mutationFn: requestConfirmationCode,
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data)
      reset()
    },
  })

  const handleRequestCode = (formData: RequestConfirmationCodeForm) => mutate(formData)

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Solicitar nuevo código</h2>
        <p className="text-slate-300 text-sm mt-1">Te enviaremos un nuevo código de verificación</p>
      </div>

      <form onSubmit={handleSubmit(handleRequestCode)} className="space-y-5" noValidate>
        <div className="space-y-1.5">
          <label className={authLabelClass}>Email</label>
          <input
            id="email"
            type="email"
            placeholder="usuario@empresa.com"
            className={authInputClass}
            {...register('email', {
              required: 'El email es obligatorio',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Email no válido' },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <button type="submit" disabled={isPending} className={authButtonClass}>
          {isPending ? 'Enviando...' : 'Enviar código'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col gap-2 text-center">
        <Link to="/auth/login" className={authLinkClass}>
          ¿Ya tienes cuenta? Iniciar sesión
        </Link>
        <Link to="/auth/forgot-password" className={authLinkClass}>
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </>
  )
}
