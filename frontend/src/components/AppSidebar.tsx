import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, UserRound, type LucideIcon } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import AppLogo from '@/components/AppLogo'
import { Skeleton } from '@/components/ui/skeleton'
import NavUser from '@/components/NavUser'
import { APP_DESCRIPTION, APP_NAME } from '@/lib/config'
import type { User } from '@/types/index'

type NavItem = { title: string; to: string; icon: LucideIcon }
type NavGroup = { label: string; items: NavItem[] }

/** Menú agrupado por secciones. Agrega aquí las nuevas vistas del proyecto. */
const NAV_GROUPS: NavGroup[] = [
  { label: 'Operación', items: [{ title: 'Dashboard', to: '/', icon: LayoutDashboard }] },
  { label: 'Cuenta', items: [{ title: 'Mi perfil', to: '/profile', icon: UserRound }] },
]

/** Ítem activo: fondo translúcido y una barra a la izquierda. */
const activeItemClass =
  'h-10 text-[15px] [&>svg]:size-5 data-[active=true]:before:absolute data-[active=true]:before:inset-y-2 data-[active=true]:before:left-0 data-[active=true]:before:w-1 data-[active=true]:before:rounded-full data-[active=true]:before:bg-sidebar-foreground'

/** Sin `user` (sesión validándose) el pie muestra un esqueleto en lugar del usuario. */
export default function AppSidebar({ user }: { user?: User }) {
  const { pathname } = useLocation()

  return (
    <Sidebar collapsible="icon">
      {/* Logo, nombre y botón para contraer/expandir (al contraer, el botón queda bajo el logo) */}
      <SidebarHeader className="flex-row items-center group-data-[collapsible=icon]:flex-col">
        <SidebarMenu className="min-w-0 flex-1">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="h-14">
              <NavLink to="/">
                <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-md">
                  <AppLogo className="size-full" iconClassName="size-6 text-brand" />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-base font-semibold" title={APP_NAME}>
                    {APP_NAME}
                  </span>
                  <span className="truncate text-xs text-sidebar-foreground/75">
                    {APP_DESCRIPTION}
                  </span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarTrigger className="size-8 shrink-0 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground [&_svg]:size-4.5" />
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/70">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.to}
                      tooltip={item.title}
                      className={activeItemClass}
                    >
                      <NavLink to={item.to}>
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        {user ? (
          <NavUser user={user} />
        ) : (
          <div className="flex h-12 items-center gap-2 px-2" aria-hidden="true">
            <Skeleton className="size-8 shrink-0 rounded-lg motion-reduce:animate-none" />
            <div className="grid flex-1 gap-1.5 group-data-[collapsible=icon]:hidden">
              <Skeleton className="h-3.5 w-3/4 motion-reduce:animate-none" />
              <Skeleton className="h-3 w-1/2 motion-reduce:animate-none" />
            </div>
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
