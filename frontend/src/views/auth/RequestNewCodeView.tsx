import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from '@tanstack/react-query';
import type { RequestConfirmationCodeForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { requestConfirmationCode } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function RequestNewCodeView() {
    const initialValues: RequestConfirmationCodeForm = { email: '' }

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const { mutate, isPending } = useMutation({
        mutationFn: requestConfirmationCode,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            toast.success(data)
            reset()
        }
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
                    <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="usuario@empresa.com"
                        className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-4 py-2.5 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                        {...register("email", {
                            required: "El email es obligatorio",
                            pattern: { value: /\S+@\S+\.\S+/, message: "Email no válido" },
                        })}
                    />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors mt-2 cursor-pointer"
                >
                    {isPending ? 'Enviando...' : 'Enviar código'}
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col gap-2 text-center">
                <Link to="/auth/login" className="text-xs text-slate-400 hover:text-teal-400 transition-colors">
                    ¿Ya tienes cuenta? Iniciar sesión
                </Link>
                <Link to="/auth/forgot-password" className="text-xs text-slate-400 hover:text-teal-400 transition-colors">
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>
        </>
    )
}
