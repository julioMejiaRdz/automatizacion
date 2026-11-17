import { Component, type ErrorInfo, type ReactNode } from 'react'
import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ErrorBoundaryProps = {
  children: ReactNode
  /** Ocupa toda la pantalla (respaldo raíz, cuando no hay layout que mostrar). */
  fullScreen?: boolean
}

type ErrorBoundaryState = { error: Error | null }

/** Falla al descargar una vista lazy: suele pasar tras desplegar una versión nueva. */
const isChunkLoadError = (error: Error) =>
  /dynamically imported module|Importing a module script failed|Failed to fetch/i.test(
    error.message,
  )

/**
 * Captura los errores de render de sus hijos y muestra un aviso con opción de reintentar, en lugar
 * de dejar la pantalla en blanco. En AppLayout envuelve solo el contenido (el sidebar sigue visible)
 * y se reinicia al cambiar de ruta.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error al mostrar la vista:', error, info.componentStack)
  }

  retry = () => {
    // Si falló la descarga de la vista, reintentar el render no sirve: hay que recargar la app
    if (this.state.error && isChunkLoadError(this.state.error)) window.location.reload()
    else this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    const chunkError = isChunkLoadError(error)

    return (
      <div
        role="alert"
        className={cn(
          'flex flex-col items-center justify-center gap-4 px-6 text-center',
          this.props.fullScreen ? 'min-h-dvh bg-background' : 'min-h-[60vh]',
        )}
      >
        <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <TriangleAlert className="size-7" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Algo salió mal</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            {chunkError
              ? 'Hay una versión nueva de la aplicación. Recarga para continuar.'
              : 'Ocurrió un error inesperado al mostrar esta vista.'}
          </p>
        </div>
        {import.meta.env.DEV && (
          <pre className="max-w-xl overflow-auto rounded-md bg-muted px-3 py-2 text-left text-xs text-muted-foreground">
            {error.message}
          </pre>
        )}
        <div className="flex gap-2">
          <Button onClick={this.retry}>{chunkError ? 'Recargar' : 'Reintentar'}</Button>
          <Button variant="outline" asChild>
            {/* Enlace normal (recarga completa): funciona aunque el router sea lo que falló */}
            <a href="/">Ir al inicio</a>
          </Button>
        </div>
      </div>
    )
  }
}
