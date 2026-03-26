import { Fragment } from 'react'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '../types'
import { useQueryClient } from '@tanstack/react-query'
import socket from '@/lib/socket'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import { UserIcon, ChevronDownIcon } from '@heroicons/react/24/solid'

type NavMenuProps = {
  name: User['name']
}

export default function NavMenu({ name }: NavMenuProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const logout = () => {
    socket.disconnect()
    localStorage.removeItem('AUTH_TOKEN')
    localStorage.setItem('show_farewell', '1')
    queryClient.removeQueries({ queryKey: ['user'] })
    navigate('/auth/login')
  }

  const initial = name?.charAt(0).toUpperCase()

  return (
    <Popover className="relative">
      <PopoverButton className="flex items-center gap-2.5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-500 rounded-lg px-3 py-1.5 transition-colors focus:outline-none">
        <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold text-white">
          <UserIcon className='h-4 w-4'/>
        </div>
        <span className="text-sm text-slate-300 font-medium hidden sm:block">{name}</span>
        <ChevronDownIcon className='h-3 w-3 text-white'/>
      </PopoverButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel className="absolute right-0 z-10 mt-2 w-52">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden">

            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-teal-500 border border-teal-500/30 flex items-center justify-center text-sm font-bold text-teal-100 dark:text-teal-200">
                    {initial}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white leading-tight">{name}</p>
                  </div>
                </div>
                <AnimatedThemeToggler duration={600} />
              </div>
            </div>

            <div className="p-1.5">
              <Link
                to="/profile"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Mi perfil
              </Link>

              <Link
                to="/"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard
              </Link>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  )
}
