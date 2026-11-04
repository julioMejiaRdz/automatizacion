import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { updatePasswordWithToken } from '@/api/AuthAPI'
import ErrorMessage from '@/components/ErrorMessage'
import { authButtonClass, authInputClass, authLabelClass } from '@/components/auth/styles'
import type { ConfirmToken, NewPasswordForm as NewPasswordFormData } from '@/types/index'

export default function NewPasswordForm({ token }: ConfirmToken) {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormData>({ defaultValues: { password: '', password_confirmation: '' } })

  const { mutate, isPending } = useMutation({
    mutationFn: updatePasswordWithToken,
    onError: (error) => toast.error(error.message),
    onSuccess: (message) => {
      toast.success(message)
      navigate('/auth/login')
    },
  })

  return (
    <form
      onSubmit={handleSubmit((formData) => mutate({ formData, token }))}
      className="space-y-5"
      noValidate
    >
      <div className="space-y-1.5">
        <label htmlFor="password" className={authLabelClass}>
          Nueva contraseña
        </label>
        <input
          id="password"
          type="password"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          className={authInputClass}
          {...register('password', {
            required: 'La contraseña es obligatoria',
            minLength: { value: 8, message: 'Mínimo 8 caracteres' },
          })}
        />
        {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password_confirmation" className={authLabelClass}>
          Confirmar contraseña
        </label>
        <input
          id="password_confirmation"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          className={authInputClass}
          {...register('password_confirmation', {
            required: 'Confirma tu contraseña',
            validate: (value, values) =>
              value === values.password || 'Las contraseñas no coinciden',
          })}
        />
        {errors.password_confirmation && (
          <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
        )}
      </div>

      <button type="submit" disabled={isPending} className={authButtonClass}>
        {isPending ? 'Guardando...' : 'Establecer contraseña'}
      </button>
    </form>
  )
}
