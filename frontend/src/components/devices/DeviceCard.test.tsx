import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import DeviceCard from './DeviceCard'
import type { Device } from '@/types/index'

const device: Device = {
  _id: 'demo-001',
  name: 'Dispositivo de ejemplo',
  topic: 'planta/demo-001',
  fields: [
    { key: 'temperatura', label: 'Temperatura', unit: '°C' },
    { key: 'en_marcha', unit: '' },
  ],
}

describe('DeviceCard', () => {
  it('muestra los campos esperando datos cuando no hay lectura', () => {
    render(<DeviceCard device={device} />)
    expect(screen.getByText('Esperando datos...')).toBeInTheDocument()
    expect(screen.getByText('Temperatura')).toBeInTheDocument()
    // Sin label se usa la key
    expect(screen.getByText('en_marcha')).toBeInTheDocument()
  })

  it('muestra los valores de la lectura', () => {
    render(
      <DeviceCard
        device={device}
        reading={{
          deviceId: 'demo-001',
          timestamp: '2026-01-01T12:00:00Z',
          values: { temperatura: 25.456, en_marcha: true },
        }}
      />,
    )
    expect(screen.getByText('25,46')).toBeInTheDocument()
    expect(screen.getByText('Sí')).toBeInTheDocument()
  })
})
