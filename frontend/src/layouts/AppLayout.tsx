import { Suspense, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'
import AppSidebar from '@/components/AppSidebar'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { SocketProvider } from '@/context/SocketProvider'
import { useAuth } from '@/hooks/useAuth'

/** Layout de las vistas autenticadas: sidebar + cabecera + contenido, con el socket conectado. */
export default function AppLayout() {
  const { data, isError, isLoading } = useAuth()

  useEffect(() => {
    if (localStorage.getItem('show_welcome') && data) {
      toast.success(`Bienvenido, ${data.name}`)
      localStorage.removeItem('show_welcome')
    }
  }, [data])

  if (isLoading) return <p className="p-6 text-muted-foreground">Cargando...</p>
  if (isError || !data) return <Navigate to="/auth/login" />

  return (
    <SocketProvider>
      <SidebarProvider>
        <AppSidebar user={data} />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <div className="ml-auto">
              <AnimatedThemeToggler
                duration={600}
                className="flex size-9 items-center justify-center rounded-md hover:bg-accent [&_svg]:size-4"
              />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">
            <Suspense fallback={<p className="text-muted-foreground">Cargando...</p>}>
              <Outlet />
            </Suspense>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </SocketProvider>
  )
}
