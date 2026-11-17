import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { updatePasswordWithToken } from '@/api/AuthAPI'
import { AuthButton, PasswordField } from '@/components/auth/AuthForm'
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
      className="space-y-4 short:space-y-3"
      noValidate
    >
      <PasswordField
        id="password"
        label="Nueva contraseña"
        placeholder="Mínimo 8 caracteres"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password', {
          required: 'La contraseña es obligatoria',
          minLength: { value: 8, message: 'Mínimo 8 caracteres' },
        })}
      />
      <PasswordField
        id="password_confirmation"
        label="Confirmar contraseña"
        placeholder="Repite la contraseña"
        autoComplete="new-password"
        error={errors.password_confirmation?.message}
        {...register('password_confirmation', {
          required: 'Confirma tu contraseña',
          validate: (value, values) => value === values.password || 'Las contraseñas no coinciden',
        })}
      />
      <AuthButton type="submit" loading={isPending}>
        {isPending ? 'Guardando...' : 'Establecer contraseña'}
      </AuthButton>
    </form>
  )
}
