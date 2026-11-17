import { Link } from 'react-router-dom'
import { ChevronsUpDown, LogOut, UserRound } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useLogout } from '@/hooks/useLogout'
import type { User } from '@/types/index'

export default function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar()
  const logout = useLogout()
  const initial = user.name.charAt(0).toUpperCase()

  // En el sidebar (fondo de marca) el avatar va invertido y el email en blanco translúcido;
  // en el menú desplegable (fondo del tema) se usan los colores normales
  const userInfo = (inSidebar: boolean) => (
    <>
      <Avatar className="size-8 rounded-lg">
        <AvatarFallback
          className={
            inSidebar
              ? 'rounded-lg bg-white text-brand'
              : 'rounded-lg bg-brand text-brand-foreground'
          }
        >
          {initial}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{user.name}</span>
        <span
          className={`truncate text-xs ${inSidebar ? 'text-sidebar-foreground/75' : 'text-muted-foreground'}`}
        >
          {user.email}
        </span>
      </div>
    </>
  )

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {userInfo(true)}
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5">{userInfo(false)}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">
                <UserRound />
                Mi perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={logout}>
              <LogOut />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
