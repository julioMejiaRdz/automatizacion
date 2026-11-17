import type { LucideIcon } from 'lucide-react'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import { SidebarTrigger } from '@/components/ui/sidebar'

type PageHeaderProps = {
  icon: LucideIcon
  title: string
  description?: string
}

/**
 * Encabezado de las vistas principales: bloque del color de marca con icono, título y descripción.
 * Lleva el cambio de tema (arriba a la derecha) y, en celular, el botón para abrir el sidebar.
 */
export default function PageHeader({ icon: Icon, title, description }: PageHeaderProps) {
  return (
    <header className="relative rounded-2xl bg-brand-panel px-6 pt-14 pb-9 text-brand-foreground shadow-lg md:px-12 md:py-20">
      <div className="absolute inset-x-3 top-3 flex items-center">
        <SidebarTrigger className="size-9 text-white hover:bg-white/15 hover:text-white md:hidden" />
        <AnimatedThemeToggler
          duration={600}
          aria-label="Cambiar tema"
          className="ml-auto flex size-9 items-center justify-center rounded-md text-white/90 hover:bg-white/15 hover:text-white [&_svg]:size-5"
        />
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15 md:size-20 md:rounded-2xl">
          <Icon className="size-6 md:size-9" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-balance md:text-5xl">{title}</h1>
      </div>
      {description && (
        <p className="mt-4 max-w-4xl text-base text-white/90 md:mt-6 md:text-xl">{description}</p>
      )}
    </header>
  )
}
