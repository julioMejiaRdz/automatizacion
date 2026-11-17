import { useState, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowBigUpDash, Loader2, Lock, type LucideIcon } from 'lucide-react'
import ErrorMessage from '@/components/ErrorMessage'
import { cn } from '@/lib/utils'

// Piezas compartidas por los formularios de autenticación. Usan los tokens del tema
// (claro/oscuro) y el color de marca.

export function AuthHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6 short:mb-4">
      <h2 className="text-2xl font-semibold text-foreground short:text-xl">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

type AuthFieldProps = ComponentProps<'input'> & {
  id: string
  label: string
  icon: LucideIcon
  error?: string
  /** Contenido a la derecha dentro del campo (p. ej. el botón Mostrar) */
  trailing?: ReactNode
  /** Aviso informativo bajo el campo (no es un error) */
  hint?: ReactNode
}

export function AuthField({
  id,
  label,
  icon: Icon,
  error,
  trailing,
  hint,
  className,
  ...props
}: AuthFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div
        className={cn(
          'flex h-11 items-center gap-2.5 short:h-10 rounded-lg border bg-muted/60 px-3 transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20',
          error && 'border-destructive',
        )}
      >
        <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          id={id}
          aria-invalid={!!error}
          className={cn(
            'h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground',
            className,
          )}
          {...props}
        />
        {trailing}
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {hint}
    </div>
  )
}

/** Campo de contraseña con botón para mostrarla u ocultarla y aviso de Bloq Mayús. */
export function PasswordField({
  onKeyDown,
  onKeyUp,
  onBlur,
  ...props
}: Omit<AuthFieldProps, 'icon' | 'type' | 'trailing' | 'hint'>) {
  const [visible, setVisible] = useState(false)
  const [capsLock, setCapsLock] = useState(false)

  const checkCapsLock = (event: KeyboardEvent<HTMLInputElement>) =>
    setCapsLock(event.getModifierState('CapsLock'))

  return (
    <AuthField
      {...props}
      icon={Lock}
      type={visible ? 'text' : 'password'}
      onKeyDown={(event) => {
        checkCapsLock(event)
        onKeyDown?.(event)
      }}
      onKeyUp={(event) => {
        checkCapsLock(event)
        onKeyUp?.(event)
      }}
      onBlur={(event) => {
        setCapsLock(false)
        onBlur?.(event)
      }}
      hint={
        capsLock && (
          <p className="flex items-center gap-1.5 text-xs text-amber-600" role="status">
            <ArrowBigUpDash className="size-3.5" aria-hidden="true" />
            Bloq Mayús está activado
          </p>
        )
      }
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="shrink-0 cursor-pointer text-xs font-semibold text-brand hover:underline"
        >
          {visible ? 'Ocultar' : 'Mostrar'}
        </button>
      }
    />
  )
}

/** Botón principal. Con `loading` muestra un spinner y se deshabilita. */
export function AuthButton({
  className,
  loading = false,
  disabled,
  children,
  ...props
}: ComponentProps<'button'> & { loading?: boolean }) {
  return (
    <button
      className={cn(
        'flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand text-sm font-semibold text-brand-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 short:h-10',
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}

export function AuthLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="font-medium text-brand hover:underline">
      {children}
    </Link>
  )
}

/** Pie con enlaces a otras vistas de autenticación. */
export function AuthFooter({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 flex flex-col gap-2 border-t pt-6 text-center short:mt-4 short:pt-4 text-sm text-muted-foreground">
      {children}
    </div>
  )
}
