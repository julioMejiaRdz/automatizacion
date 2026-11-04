import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import { useTheme } from '@/hooks/useTheme'

// Layouts y vistas se cargan bajo demanda (code splitting) para reducir el bundle inicial
const AppLayout = lazy(() => import('@/layouts/AppLayout'))
const AuthLayout = lazy(() => import('@/layouts/AuthLayout'))
const DashboardView = lazy(() => import('@/views/DashboardView'))
const ProfileView = lazy(() => import('@/views/ProfileView'))
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
      <Suspense fallback={null}>
        <Routes>
          {/* Vistas autenticadas (sidebar + socket conectado) */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardView />} index />
            <Route path="/profile" element={<ProfileView />} />
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
      <ToastContainer
        position="top-right"
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        theme={theme}
      />
    </BrowserRouter>
  )
}
