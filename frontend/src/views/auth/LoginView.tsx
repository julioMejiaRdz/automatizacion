import { useForm } from "react-hook-form"
import type { UserLoginForm } from "@/types/index"
import { useMutation } from "@tanstack/react-query"
import ErrorMessage from "@/components/ErrorMessage"
import { Link, useNavigate } from "react-router-dom"
import { login } from "@/api/AuthAPI"
import { toast } from "react-toastify"
import { useEffect } from "react"

export default function LoginView() {

  const initialValues: UserLoginForm = { email: '', password: '' }

  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

  useEffect( () => {
      if(localStorage.getItem('show_farewell')){
        toast.info('Sesion Cerrada')
        localStorage.removeItem('show_farewell')
      }
  },[])

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onError: (error) => toast.error(error.message),
    onSuccess: () => {
      localStorage.setItem('show_welcome', '1')
      navigate('/')
    }
  })

  const handleLogin = (formData: UserLoginForm) => mutate(formData)

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Iniciar sesión</h2>
        <p className="text-slate-300 text-sm mt-1">Accede a tu panel de monitoreo</p>
      </div>

      <form onSubmit={handleSubmit(handleLogin)} className="space-y-5" noValidate>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-200 uppercase tracking-wider">
            Email
          </label>
          <input
            type="email"
            placeholder="Email empresarial"
            className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-4 py-2.5 placeholder-slate-300 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
            {...register("email", {
              required: "El email es obligatorio",
              pattern: { value: /\S+@\S+\.\S+/, message: "Email no válido" }
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-200 uppercase tracking-wider">
            Contraseña
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-4 py-2.5 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
            {...register("password", { required: "La contraseña es obligatoria" })}
          />
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors mt-2 cursor-pointer"
        >
          {isPending ? 'Verificando...' : 'Acceder'}
        </button>

      </form>

      <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col gap-2 text-center">
        <Link to="/auth/register" className="text-xs text-slate-400 hover:text-teal-400 transition-colors">
          ¿No tienes cuenta? Registrarse
        </Link>
        <Link to="/auth/forgot-password" className="text-xs text-slate-400 hover:text-teal-400 transition-colors">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </>
  )
}
