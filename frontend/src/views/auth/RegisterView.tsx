import { useForm } from "react-hook-form"
import type { UserRegistrationForm } from "@/types/index"
import ErrorMessage from "@/components/ErrorMessage"
import { Link } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { createAccount } from "@/api/AuthAPI"
import { toast } from "react-toastify"

export default function RegisterView() {

  const initialValues: UserRegistrationForm = {
    name: '', email: '', password: '', password_confirmation: ''
  }

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UserRegistrationForm>({ defaultValues: initialValues })

  const { mutate, isPending } = useMutation({
    mutationFn: createAccount,
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => { toast.success(data); reset() }
  })

  const password = watch('password')
  const handleRegister = (formData: UserRegistrationForm) => mutate(formData)

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Crear cuenta</h2>
        <p className="text-slate-400 text-sm mt-1">Solicita acceso a la plataforma</p>
      </div>

      <form onSubmit={handleSubmit(handleRegister)} className="space-y-4" noValidate>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-200 uppercase tracking-wider">Nombre</label>
          <input
            type="text"
            placeholder="Nombre de usuario"
            className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-4 py-2.5 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
            {...register("name", { required: "El nombre es obligatorio" })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-200 uppercase tracking-wider">Email</label>
          <input
            type="email"
            placeholder="usuario@empresa.com"
            className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-4 py-2.5 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
            {...register("email", {
              required: "El email es obligatorio",
              pattern: { value: /\S+@\S+\.\S+/, message: "Email no válido" }
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-200 uppercase tracking-wider">Contraseña</label>
          <input
            type="password"
            placeholder="Mínimo 8 caracteres"
            className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-4 py-2.5 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: { value: 8, message: "Mínimo 8 caracteres" }
            })}
          />
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-200 uppercase tracking-wider">Confirmar contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-4 py-2.5 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
            {...register("password_confirmation", {
              required: "Confirma tu contraseña",
              validate: value => value === password || 'Las contraseñas no coinciden'
            })}
          />
          {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors mt-2"
        >
          {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

      </form>

      <div className="mt-6 pt-6 border-t border-slate-800 text-center">
        <Link to="/auth/login" className="text-xs text-slate-500 hover:text-teal-400 transition-colors">
          ¿Ya tienes cuenta? Iniciar sesión
        </Link>
      </div>
    </>
  )
}
