import { describe, expect, it } from 'vitest'
import { parsePayload } from '../src/services/mqtt'

describe('parsePayload', () => {
  it('separa timestamp y valores de un payload plano', () => {
    const reading = parsePayload(
      'demo-001',
      JSON.stringify({ timestamp: '2026-01-01T00:00:00Z', temperatura: 25.4, en_marcha: true }),
    )
    expect(reading).toEqual({
      deviceId: 'demo-001',
      timestamp: '2026-01-01T00:00:00Z',
      values: { temperatura: 25.4, en_marcha: true },
    })
  })

  it('usa la hora de recepción si no hay timestamp', () => {
    const reading = parsePayload('demo-001', '{"presion": 1.2}')
    expect(reading?.values).toEqual({ presion: 1.2 })
    expect(Number.isNaN(Date.parse(reading!.timestamp))).toBe(false)
  })

  it('ignora valores anidados', () => {
    expect(parsePayload('d', '{"a": 1, "b": {"c": 2}}')?.values).toEqual({ a: 1 })
  })

  it('rechaza payloads que no son un objeto JSON', () => {
    expect(parsePayload('d', 'no-json')).toBeNull()
    expect(parsePayload('d', '[1,2]')).toBeNull()
    expect(parsePayload('d', '42')).toBeNull()
  })
})
