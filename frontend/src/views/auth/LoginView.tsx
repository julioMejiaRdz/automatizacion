import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Mail } from 'lucide-react'
import { login } from '@/api/AuthAPI'
import {
  AuthButton,
  AuthField,
  AuthFooter,
  AuthHeader,
  AuthLink,
  PasswordField,
} from '@/components/auth/AuthForm'
import { SESSION_EXPIRED_KEY } from '@/lib/session'
import type { UserLoginForm } from '@/types/index'

export default function LoginView() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginForm>({ defaultValues: { email: '', password: '' } })

  useEffect(() => {
    if (localStorage.getItem('show_farewell')) {
      toast.info('Sesión cerrada')
      localStorage.removeItem('show_farewell')
    }
    if (localStorage.getItem(SESSION_EXPIRED_KEY)) {
      toast.warning('Tu sesión expiró. Inicia sesión de nuevo.')
      localStorage.removeItem(SESSION_EXPIRED_KEY)
    }
  }, [])

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      localStorage.setItem('show_welcome', '1')
      navigate('/')
    },
  })

  return (
    <>
      <AuthHeader title="Iniciar sesión" description="Ingresa tus credenciales de acceso" />

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
          autoFocus
          error={errors.email?.message}
          {...register('email', {
            required: 'El email es obligatorio',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Email no válido' },
          })}
        />
        <PasswordField
          id="password"
          label="Contraseña"
          placeholder="Tu contraseña"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password', { required: 'La contraseña es obligatoria' })}
        />
        <div className="text-right text-sm">
          <Link to="/auth/forgot-password" className="text-brand hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <AuthButton type="submit" loading={isPending}>
          {isPending ? 'Autenticando...' : 'Acceder'}
        </AuthButton>
      </form>

      <AuthFooter>
        <span>
          ¿No tienes cuenta? <AuthLink to="/auth/register">Regístrate</AuthLink>
        </span>
      </AuthFooter>
    </>
  )
}
