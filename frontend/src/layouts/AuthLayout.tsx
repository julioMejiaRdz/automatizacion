import { Suspense } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AppLogo from '@/components/AppLogo'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import { useAuth } from '@/hooks/useAuth'
import { APP_DESCRIPTION, APP_NAME, FOOTER_TEXT } from '@/lib/config'

/**
 * Layout de las vistas públicas de autenticación.
 * - Escritorio: panel de marca alto a la derecha (logo, nombre y descripción)
 *   y la tarjeta del formulario superpuesta a la izquierda, sobre un fondo con una onda del
 *   color de marca.
 * - Celular: el panel se reduce a una franja con logo y nombre encima del formulario.
 * La tarjeta del formulario es siempre clara (`theme-light`); el resto sigue el tema.
 */
export default function AuthLayout() {
  const { isError, isLoading } = useAuth()

  if (isLoading) return <p className="p-6 text-muted-foreground">Cargando...</p>
  if (!isError) return <Navigate to="/" />

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-x-hidden bg-muted p-4 md:overflow-hidden md:px-8 md:py-6 dark:bg-background">
      {/* Onda de fondo (celular; en escritorio la dibuja la cinta del panel) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] w-full fill-brand-panel md:hidden"
      >
        <path d="M0,170 C220,520 520,560 860,430 C1100,340 1280,240 1440,190 L1440,600 L0,600 Z" />
      </svg>

      <AnimatedThemeToggler
        duration={600}
        className="absolute top-4 right-4 z-20 flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground [&_svg]:size-4"
      />

      {/* En escritorio la composición ocupa el alto de la pantalla (máx. 720px) para que no haya scroll */}
      <div className="relative z-10 flex w-full max-w-md flex-col gap-4 md:block md:h-[min(680px,calc(100dvh-3rem))] md:w-[clamp(44rem,58vw,60rem)] md:max-w-none">
        {/* Panel de marca */}
        {/* md:px igual a ambos lados: el contenido queda centrado en el panel y libre de la franja que tapa el formulario. El % del padding se calcula sobre el contenedor: el formulario (51%) tapa 7% de él (51% - 44% libre a su izquierda) */}
        <aside className="relative overflow-hidden rounded-3xl bg-brand-panel px-6 py-5 text-brand-foreground shadow-xl md:ml-auto md:flex md:h-full md:w-[56%] md:flex-col md:px-[calc(7%+1rem)] md:pt-8 md:pb-32 short:md:pt-6 short:md:pb-28">
          {/* Logo, nombre y descripción: centrados en vertical en el espacio libre sobre la cinta */}
          <div className="relative flex items-center gap-4 md:my-auto md:flex-col md:gap-8 short:md:gap-5">
            <div className="flex h-16 w-auto max-w-full shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-sm md:h-40 md:w-full md:rounded-2xl md:p-5 short:md:h-28 short:md:p-3">
              <AppLogo
                className="h-full w-auto max-w-full md:w-full"
                iconClassName="size-7 text-brand md:size-16"
              />
            </div>
            <div className="text-left md:flex md:w-full md:flex-col md:items-center md:text-center">
              <h1
                className="line-clamp-3 text-lg font-semibold text-balance md:text-4xl md:leading-tight short:md:text-3xl"
                title={APP_NAME}
              >
                {APP_NAME}
              </h1>
              {/* Separador */}
              <span
                aria-hidden="true"
                className="hidden h-1 w-14 rounded-full bg-white/60 md:my-4 md:block short:md:my-3"
              />
              <p className="mt-1 text-sm text-white/80 text-balance md:mt-0 md:text-lg short:md:text-base">
                {APP_DESCRIPTION}
              </p>
            </div>
          </div>
        </aside>

        {/* Escritorio: cinta blanca que cruza la base del panel y continúa por toda la pantalla, con el
            azul de marca debajo. Va encima del panel (tapa su borde inferior, así el azul del panel
            y el del fondo se unen) y debajo del formulario. Se posiciona respecto al panel para que
            la cinta siempre lo cruce cerca de su base */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 416"
          preserveAspectRatio="none"
          className="pointer-events-none absolute top-[calc(100%-20rem)] left-1/2 hidden h-104 w-screen -translate-x-1/2 md:block"
        >
          <path
            className="fill-white"
            d="M0,30 C200,300 400,340 600,280 C820,214 1100,230 1440,160 L1440,196 C1100,266 820,250 600,316 C400,376 200,336 0,66 Z"
          />
          <path
            className="fill-brand-panel"
            d="M0,66 C200,336 400,376 600,316 C820,250 1100,266 1440,196 L1440,416 L0,416 Z"
          />
        </svg>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[calc(100%+6rem-1px)] left-1/2 hidden h-dvh w-screen -translate-x-1/2 bg-brand-panel md:block"
        />

        {/* Tarjeta del formulario (siempre clara) */}
        <section className="theme-light relative overflow-hidden rounded-3xl bg-card p-8 text-card-foreground shadow-2xl md:absolute md:top-1/2 md:left-0 md:w-[51%] md:-translate-y-1/2 md:px-10 md:py-9 short:md:px-8 short:md:py-6">
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </section>
      </div>

      {FOOTER_TEXT && (
        <p className="absolute inset-x-0 bottom-3 z-10 text-center text-xs text-white/80 md:right-1/2">
          {FOOTER_TEXT}
        </p>
      )}
    </div>
  )
}
