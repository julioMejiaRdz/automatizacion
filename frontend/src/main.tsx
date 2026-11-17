import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TooltipProvider } from '@/components/ui/tooltip'
// Fuentes autoalojadas (sin depender de Google Fonts: funcionan en LAN sin internet y con la CSP 'self')
import '@fontsource-variable/inter'
import '@fontsource-variable/plus-jakarta-sans'
import './index.css'
import { applyBrandColor } from '@/lib/brand'
import Router from './router'

applyBrandColor()

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
      </TooltipProvider>
      {/* Solo se incluye en desarrollo; Vite lo elimina del build de producción */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
)
