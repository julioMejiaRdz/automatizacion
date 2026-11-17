import { useState } from 'react'
import { RadioTower } from 'lucide-react'
import { APP_LOGO, APP_NAME } from '@/lib/config'
import { cn } from '@/lib/utils'

type AppLogoProps = {
  /** Clases del contenedor: definen el tamaño máximo del logo */
  className?: string
  /** Clases del icono genérico que se muestra si no hay logo o no carga */
  iconClassName?: string
}

/** Logo del cliente (VITE_APP_LOGO, archivo en frontend/public) o un icono IoT genérico. */
export default function AppLogo({ className, iconClassName }: AppLogoProps) {
  const [failed, setFailed] = useState(false)

  if (APP_LOGO && !failed) {
    return (
      <img
        src={APP_LOGO}
        alt={APP_NAME}
        onError={() => setFailed(true)}
        className={cn('object-contain', className)}
      />
    )
  }

  return (
    <div className={cn('flex items-center justify-center', className)} aria-hidden="true">
      <RadioTower className={iconClassName} />
    </div>
  )
}
