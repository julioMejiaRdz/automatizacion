import { useQuery } from '@tanstack/react-query'
import { getDevices } from '@/api/DeviceAPI'
import DeviceCard from '@/components/devices/DeviceCard'
import { useDeviceReadings } from '@/hooks/useDeviceReadings'

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

  const { readings, connected, errors } = useDeviceReadings(devices.map((device) => device._id))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className={`size-2.5 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
          {connected ? 'Tiempo real conectado' : 'Tiempo real desconectado'}
        </div>
      </div>

      {isLoading && <p className="text-muted-foreground">Cargando dispositivos...</p>}
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
          />
        ))}
      </div>
    </div>
  )
}
