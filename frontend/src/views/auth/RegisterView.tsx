import {
  authButtonClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
} from '@/components/auth/styles'
import { useForm } from 'react-hook-form'
import type { UserRegistrationForm } from '@/types/index'
import ErrorMessage from '@/components/ErrorMessage'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { createAccount } from '@/api/AuthAPI'
import { toast } from 'react-toastify'

export default function RegisterView() {
  const initialValues: UserRegistrationForm = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserRegistrationForm>({ defaultValues: initialValues })

  const { mutate, isPending } = useMutation({
    mutationFn: createAccount,
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data)
      reset()
    },
  })

  const handleRegister = (formData: UserRegistrationForm) => mutate(formData)

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Crear cuenta</h2>
        <p className="text-slate-400 text-sm mt-1">Solicita acceso a la plataforma</p>
      </div>

      <form onSubmit={handleSubmit(handleRegister)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label className={authLabelClass}>Nombre</label>
          <input
            type="text"
            placeholder="Nombre de usuario"
            className={authInputClass}
            {...register('name', { required: 'El nombre es obligatorio' })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>

        <div className="space-y-1.5">
          <label className={authLabelClass}>Email</label>
          <input
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

        <div className="space-y-1.5">
          <label className={authLabelClass}>Contraseña</label>
          <input
            type="password"
            placeholder="Mínimo 8 caracteres"
            className={authInputClass}
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: { value: 8, message: 'Mínimo 8 caracteres' },
            })}
          />
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </div>

        <div className="space-y-1.5">
          <label className={authLabelClass}>Confirmar contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
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
          {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-800 text-center">
        <Link to="/auth/login" className={authLinkClass}>
          ¿Ya tienes cuenta? Iniciar sesión
        </Link>
      </div>
    </>
  )
}
