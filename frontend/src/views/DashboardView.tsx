import { useQuery } from '@tanstack/react-query'
import { LayoutDashboard } from 'lucide-react'
import { getDevices } from '@/api/DeviceAPI'
import PageHeader from '@/components/PageHeader'
import DeviceCard from '@/components/devices/DeviceCard'
import DeviceCardSkeleton from '@/components/devices/DeviceCardSkeleton'
import LinkIndicator from '@/components/devices/LinkIndicator'
import { useDeviceReadings } from '@/hooks/useDeviceReadings'
import { useNow } from '@/hooks/useNow'
import { formatElapsed, getDeviceStatus } from '@/lib/deviceStatus'

export default function DashboardView() {
  const {
    data: devices = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices,
  })

  const { readings, seenAt, connected, mqttConnected, errors } = useDeviceReadings(
    devices.map((device) => device._id),
  )
  // Se recalcula cada 5 s para detectar dispositivos que dejaron de enviar datos
  const now = useNow(5000)

  return (
    <div className="space-y-6">
      <PageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        description="Lecturas en tiempo real de los dispositivos conectados."
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Dispositivos</h2>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <LinkIndicator label="Servidor" connected={connected} />
          <LinkIndicator label="Broker MQTT" connected={mqttConnected} />
        </div>
      </div>

      {isLoading && (
        <div role="status" className="grid animate-delayed-in gap-6 xl:grid-cols-2">
          <span className="sr-only">Cargando dispositivos...</span>
          {Array.from({ length: 2 }, (_, i) => (
            <DeviceCardSkeleton key={i} />
          ))}
        </div>
      )}
      {isError && <p className="text-destructive">{error.message}</p>}
      {!isLoading && !isError && devices.length === 0 && (
        <p className="text-muted-foreground">
          No hay dispositivos registrados. Créalos con <code>POST /api/devices</code> o con{' '}
          <code>npm run seed</code> en el backend.
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        {devices.map((device) => (
          <DeviceCard
            key={device._id}
            device={device}
            reading={readings[device._id]}
            error={errors[device._id]}
            status={getDeviceStatus(seenAt[device._id], now)}
            lastSeen={
              seenAt[device._id] !== undefined ? formatElapsed(now - seenAt[device._id]) : undefined
            }
          />
        ))}
      </div>
    </div>
  )
}
