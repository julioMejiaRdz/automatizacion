import { useEffect, useState } from 'react'

/** Alto (px) y retraso de la animación (s) de cada barra, de menor a mayor. */
const BARS = [6, 11, 16, 22, 28].map((height, i) => ({ height, delay: i * 0.12 }))

/** Mensajes según el tiempo de espera (ms): avisa si la carga tarda más de lo normal. */
const MESSAGES = [
  { after: 0, text: 'Cargando' },
  { after: 5_000, text: 'Espera, esto puede tardar un poco más' },
  { after: 15_000, text: 'Está tardando más de lo normal. Revisa tu conexión' },
]

/**
 * Pantalla completa de carga: se muestra mientras se descarga la app (layouts lazy) y mientras
 * se valida la sesión. Aparece con 200 ms de retraso para no parpadear en cargas rápidas.
 */
export default function PageLoader() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = MESSAGES.slice(1).map(({ after }, i) => setTimeout(() => setStep(i + 1), after))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div
      role="status"
      className="flex min-h-dvh animate-delayed-in flex-col items-center justify-center gap-4 bg-background px-6"
    >
      <div className="signal-loader" aria-hidden="true">
        {BARS.map(({ height, delay }) => (
          <span key={height} style={{ height, animationDelay: `${delay}s` }} />
        ))}
      </div>
      <p className="text-center text-xs tracking-wider text-muted-foreground">
        {MESSAGES[step].text}
      </p>
    </div>
  )
}
