import { type CSSProperties, Suspense, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import AppSidebar from '@/components/AppSidebar'
import ErrorBoundary from '@/components/ErrorBoundary'
import Loader from '@/components/loading/Loader'
import ViewSkeleton from '@/components/loading/ViewSkeleton'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { SocketProvider } from '@/context/SocketProvider'
import { useAuth } from '@/hooks/useAuth'

/**
 * Layout de las vistas autenticadas: sidebar + cabecera + contenido, con el socket conectado.
 * El marco se pinta de inmediato; mientras se valida la sesión el contenido muestra el Loader
 * y, al navegar, ViewSkeleton mientras se descarga la vista.
 */
export default function AppLayout() {
  const { data, isError, isLoading } = useAuth()
  const { pathname } = useLocation()

  useEffect(() => {
    if (localStorage.getItem('show_welcome') && data) {
      toast.success(`Bienvenido, ${data.name}`)
      localStorage.removeItem('show_welcome')
    }
  }, [data])

  if (!isLoading && (isError || !data)) return <Navigate to="/auth/login" />

  return (
    // Ancho del sidebar (shadcn usa 16rem por defecto). Sin barra superior: el botón del sidebar
    // está en su cabecera y el cambio de tema en PageHeader
    <SidebarProvider style={{ '--sidebar-width': '15rem' } as CSSProperties}>
      <AppSidebar user={data} />
      <SidebarInset>
        <main className="flex-1 p-4 md:p-6">
          {/* El socket se conecta solo con la sesión ya validada */}
          {data ? (
            <SocketProvider>
              {/* key: al cambiar de ruta se limpia el error de la vista anterior */}
              <ErrorBoundary key={pathname}>
                <Suspense fallback={<ViewSkeleton />}>
                  <Outlet />
                </Suspense>
              </ErrorBoundary>
            </SocketProvider>
          ) : (
            <Loader />
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
