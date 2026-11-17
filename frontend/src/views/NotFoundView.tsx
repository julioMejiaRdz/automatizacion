import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'

/** Ruta inexistente dentro de la app (requiere sesión; sin ella se redirige al login). */
export default function NotFoundView() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileQuestion}
        title="Página no encontrada"
        description="La dirección que abriste no existe o fue movida."
      />
      <Button asChild>
        <Link to="/">Volver al inicio</Link>
      </Button>
    </div>
  )
}
