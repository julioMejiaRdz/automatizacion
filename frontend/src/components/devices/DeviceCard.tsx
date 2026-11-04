import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Device, DeviceReading, ReadingValue } from '@/types/index'

type DeviceCardProps = {
  device: Device
  reading?: DeviceReading
  error?: string
}

const formatValue = (value: ReadingValue | undefined) => {
  if (value === undefined || value === null) return '—'
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'
  if (typeof value === 'number') return value.toLocaleString('es', { maximumFractionDigits: 2 })
  return value
}

export default function DeviceCard({ device, reading, error }: DeviceCardProps) {
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
