import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Mail } from 'lucide-react'
import { forgotPassword } from '@/api/AuthAPI'
import { AuthButton, AuthField, AuthFooter, AuthHeader, AuthLink } from '@/components/auth/AuthForm'
import type { ForgotPasswordForm } from '@/types/index'

export default function ForgotPasswordView() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({ defaultValues: { email: '' } })

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onError: (error) => toast.error(error.message),
    onSuccess: (message) => {
      toast.success(message)
      reset()
    },
  })

  return (
    <>
      <AuthHeader
        title="Restablecer contraseña"
        description="Te enviaremos un código por email para crear una nueva"
      />

      <form
        onSubmit={handleSubmit((data) => mutate(data))}
        className="space-y-4 short:space-y-3"
        noValidate
      >
        <AuthField
          id="email"
          label="Email"
          type="email"
          icon={Mail}
          placeholder="usuario@dominio.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email', {
            required: 'El email es obligatorio',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Email no válido' },
          })}
        />
        <AuthButton type="submit" loading={isPending}>
          {isPending ? 'Enviando...' : 'Enviar código'}
        </AuthButton>
      </form>

      <AuthFooter>
        <span>
          ¿Ya tienes el código? <AuthLink to="/auth/new-password">Ingrésalo aquí</AuthLink>
        </span>
        <span>
          <AuthLink to="/auth/login">Volver a iniciar sesión</AuthLink>
        </span>
      </AuthFooter>
    </>
  )
}
