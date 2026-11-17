import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { DeviceStatus } from '@/lib/deviceStatus'
import { cn } from '@/lib/utils'
import type { Device, DeviceReading, ReadingValue } from '@/types/index'

type DeviceCardProps = {
  device: Device
  reading?: DeviceReading
  error?: string
  /** Estado del enlace con el dispositivo (ver lib/deviceStatus) */
  status?: DeviceStatus
  /** Tiempo desde la última lectura ("hace 3 min"), para el estado `stale` */
  lastSeen?: string
}

const STATUS_STYLES: Record<DeviceStatus, { label: string; className: string; dot: string }> = {
  online: {
    label: 'En línea',
    className: 'bg-green-500/10 text-green-700 dark:text-green-400',
    dot: 'bg-green-500',
  },
  stale: {
    label: 'Sin datos',
    className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  waiting: {
    label: 'Esperando datos',
    className: 'bg-muted text-muted-foreground',
    dot: 'bg-muted-foreground/40',
  },
}

const formatValue = (value: ReadingValue | undefined) => {
  if (value === undefined || value === null) return '—'
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'
  if (typeof value === 'number') return value.toLocaleString('es', { maximumFractionDigits: 2 })
  return value
}

export default function DeviceCard({
  device,
  reading,
  error,
  status = 'waiting',
  lastSeen,
}: DeviceCardProps) {
  const badge = STATUS_STYLES[status]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{device.name}</CardTitle>
        <CardDescription>
          {error ??
            (reading
              ? `Última lectura: ${new Date(reading.timestamp).toLocaleString('es')}`
              : 'Esperando datos...')}
        </CardDescription>
        <CardAction>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap',
              badge.className,
            )}
            title={status === 'stale' && lastSeen ? `Última lectura ${lastSeen}` : undefined}
          >
            <span aria-hidden="true" className={cn('size-2 rounded-full', badge.dot)} />
            {badge.label}
            {status === 'stale' && lastSeen && <span className="font-normal">· {lastSeen}</span>}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        {device.fields.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Este dispositivo no tiene campos configurados.
          </p>
        ) : (
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {device.fields.map((field) => (
              <div key={field.key} className="rounded-lg border p-3">
                <dt className="text-xs text-muted-foreground">{field.label || field.key}</dt>
                <dd className="mt-1 text-xl font-semibold tabular-nums">
                  {formatValue(reading?.values[field.key])}
                  {field.unit && (
                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                      {field.unit}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </CardContent>
    </Card>
  )
}
