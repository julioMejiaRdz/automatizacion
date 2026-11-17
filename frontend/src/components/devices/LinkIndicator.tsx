import { cn } from '@/lib/utils'

type LinkIndicatorProps = {
  label: string
  /** `null`: estado desconocido (p. ej. sin conexión con el servidor) */
  connected: boolean | null
}

/** Punto de color + texto para el estado de un enlace (servidor, broker MQTT). */
export default function LinkIndicator({ label, connected }: LinkIndicatorProps) {
  const text = connected === null ? 'sin información' : connected ? 'conectado' : 'desconectado'

  return (
    <span className="flex items-center gap-2 text-sm text-muted-foreground">
      <span
        aria-hidden="true"
        className={cn(
          'size-2.5 rounded-full',
          connected === null ? 'bg-muted-foreground/40' : connected ? 'bg-green-500' : 'bg-red-500',
        )}
      />
      {label}: {text}
    </span>
  )
}
