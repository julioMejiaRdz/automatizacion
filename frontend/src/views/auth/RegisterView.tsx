import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Mail, UserRound } from 'lucide-react'
import { createAccount } from '@/api/AuthAPI'
import {
  AuthButton,
  AuthField,
  AuthFooter,
  AuthHeader,
  AuthLink,
  PasswordField,
} from '@/components/auth/AuthForm'
import type { UserRegistrationForm } from '@/types/index'

export default function RegisterView() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserRegistrationForm>({
    defaultValues: { name: '', email: '', password: '', password_confirmation: '' },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createAccount,
    onError: (error) => toast.error(error.message),
    onSuccess: (message) => {
      toast.success(message)
      reset()
    },
  })

  return (
    <>
      <AuthHeader title="Crear cuenta" description="Solicita acceso a la plataforma" />

      <form
        onSubmit={handleSubmit((data) => mutate(data))}
        className="space-y-4 short:space-y-3"
        noValidate
      >
        <AuthField
          id="name"
          label="Nombre"
          icon={UserRound}
          placeholder="Tu nombre"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name', { required: 'El nombre es obligatorio' })}
        />
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
        <PasswordField
          id="password"
          label="Contraseña"
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
            validate: (value, values) =>
              value === values.password || 'Las contraseñas no coinciden',
          })}
        />
        <AuthButton type="submit" loading={isPending}>
          {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
        </AuthButton>
      </form>

      <AuthFooter>
        <span>
          ¿Ya tienes cuenta? <AuthLink to="/auth/login">Inicia sesión</AuthLink>
        </span>
      </AuthFooter>
    </>
  )
}
