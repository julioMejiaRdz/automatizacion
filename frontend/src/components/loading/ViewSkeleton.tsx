import { Skeleton } from '@/components/ui/skeleton'

const pulse = 'motion-reduce:animate-none'

/**
 * Esqueleto genérico de una vista (título, fila de tarjetas y bloque principal). Se muestra en el
 * área de contenido de AppLayout mientras se descarga una vista; el sidebar y la cabecera no se mueven.
 */
export default function ViewSkeleton() {
  return (
    <div role="status" className="animate-delayed-in space-y-6">
      <span className="sr-only">Cargando...</span>
      <div className="flex items-center justify-between gap-2">
        <Skeleton className={`h-8 w-48 ${pulse}`} />
        <Skeleton className={`h-4 w-36 ${pulse}`} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className={`h-24 rounded-xl ${pulse}`} />
        ))}
      </div>
      <Skeleton className={`h-64 rounded-xl ${pulse}`} />
    </div>
  )
}
