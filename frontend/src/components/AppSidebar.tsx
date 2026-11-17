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
} from '@/components/ui/sidebar'
import AppLogo from '@/components/AppLogo'
import { Skeleton } from '@/components/ui/skeleton'
import NavUser from '@/components/NavUser'
import type { User } from '@/types/index'

type NavItem = { title: string; to: string; icon: LucideIcon }

/** Agrega aquí las nuevas vistas del proyecto. */
const NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', to: '/', icon: LayoutDashboard },
  { title: 'Mi perfil', to: '/profile', icon: UserRound },
]

/** Sin `user` (sesión validándose) el pie muestra un esqueleto en lugar del usuario. */
export default function AppSidebar({ user }: { user?: User }) {
  const { pathname } = useLocation()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to="/">
                <div className="flex aspect-square size-17 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white p-0.5">
                  <AppLogo className="size-full" iconClassName="size-8 text-brand" />
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={pathname === item.to} tooltip={item.title}>
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
      </SidebarContent>

      <SidebarFooter>
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
