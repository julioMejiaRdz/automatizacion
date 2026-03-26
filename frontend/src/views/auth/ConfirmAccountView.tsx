import { Link } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useMutation } from '@tanstack/react-query'
import { useState } from "react";
import type { ConfirmToken } from "@/types/index";
import { confirmAccount } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function ConfirmAccountView() {
    const [token, setToken] = useState<ConfirmToken["token"]>("");

    const handleChange = (token: ConfirmToken["token"]) => setToken(token);

    const { mutate } = useMutation({
        mutationFn: confirmAccount,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => toast.success(data)
    })

    const handleComplete = (token: ConfirmToken["token"]) => mutate({ token })

    return (
        <>
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-white">Confirmar cuenta</h2>
                <p className="text-slate-300 text-sm mt-1">Ingresa el código de 6 dígitos enviado a tu email</p>
            </div>

            <div className="space-y-5">
                <div className="space-y-3">
                    <label className="text-xs font-medium text-slate-300 uppercase tracking-wider block">
                        Código de verificación
                    </label>
                    <div className="flex justify-between gap-2">
                        <PinInput
                            value={token}
                            onChange={handleChange}
                            onComplete={handleComplete}
                        >
                            {Array.from({ length: 6 }).map((_, i) => (
                                <PinInputField
                                    key={i}
                                    className="w-full h-11 bg-slate-800 border border-slate-700 text-white text-lg font-mono rounded-lg text-center focus:border-teal-500! focus:ring-1 focus:ring-teal-500 transition-colors"
                                />
                            ))}
                        </PinInput>
                    </div>
                </div>

                <p className="text-xs text-slate-300 text-center">
                    La cuenta se confirmará automáticamente al completar el código
                </p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800 text-center">
                <Link to="/auth/request-code" className="text-xs text-slate-400 hover:text-teal-400 transition-colors">
                    ¿No recibiste el código? Solicitar uno nuevo
                </Link>
            </div>
        </>
    );
}
