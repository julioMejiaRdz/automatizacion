import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import ErrorBoundary from '@/components/ErrorBoundary'
import Loader from '@/components/loading/Loader'
import { useTheme } from '@/hooks/useTheme'

import AppLayout from '@/layouts/AppLayout'
import AuthLayout from '@/layouts/AuthLayout'

// Los layouts van en el bundle inicial para pintar el marco (sidebar, panel de marca) al instante;
// las vistas se cargan bajo demanda (code splitting) y muestran su indicador dentro del layout
const DashboardView = lazy(() => import('@/views/DashboardView'))
const ProfileView = lazy(() => import('@/views/ProfileView'))
const NotFoundView = lazy(() => import('@/views/NotFoundView'))
const LoginView = lazy(() => import('@/views/auth/LoginView'))
const RegisterView = lazy(() => import('@/views/auth/RegisterView'))
const ConfirmAccountView = lazy(() => import('@/views/auth/ConfirmAccountView'))
const RequestNewCodeView = lazy(() => import('@/views/auth/RequestNewCodeView'))
const ForgotPasswordView = lazy(() => import('@/views/auth/ForgotPasswordView'))
const NewPasswordView = lazy(() => import('@/views/auth/NewPasswordView'))

export default function Router() {
  const theme = useTheme()

  return (
    <BrowserRouter>
      {/* Respaldo raíz: si falla un layout, aviso a pantalla completa en lugar de pantalla en blanco */}
      <ErrorBoundary fullScreen>
        <Suspense fallback={<Loader fullScreen />}>
          <Routes>
            {/* Vistas autenticadas (sidebar + socket conectado) */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardView />} index />
              <Route path="/profile" element={<ProfileView />} />
              {/* Cualquier otra ruta: 404 dentro del layout (sin sesión, AppLayout lleva al login) */}
              <Route path="*" element={<NotFoundView />} />
            </Route>

            {/* Vistas públicas de autenticación */}
            <Route element={<AuthLayout />}>
              <Route path="/auth/login" element={<LoginView />} />
              <Route path="/auth/register" element={<RegisterView />} />
              <Route path="/auth/confirm-account" element={<ConfirmAccountView />} />
              <Route path="/auth/request-code" element={<RequestNewCodeView />} />
              <Route path="/auth/forgot-password" element={<ForgotPasswordView />} />
              <Route path="/auth/new-password" element={<NewPasswordView />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <ToastContainer
        position="top-right"
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        theme={theme}
      />
    </BrowserRouter>
  )
}
