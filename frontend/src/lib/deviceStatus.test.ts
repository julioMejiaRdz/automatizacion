import { describe, expect, it } from 'vitest'
import { formatElapsed, getDeviceStatus } from './deviceStatus'

describe('getDeviceStatus', () => {
  const now = 1_000_000

  it('sin lecturas está esperando datos', () => {
    expect(getDeviceStatus(undefined, now, 60_000)).toBe('waiting')
  })

  it('en línea dentro del tiempo límite y sin datos después', () => {
    expect(getDeviceStatus(now - 60_000, now, 60_000)).toBe('online')
    expect(getDeviceStatus(now - 60_001, now, 60_000)).toBe('stale')
  })
})

describe('formatElapsed', () => {
  it('usa la unidad adecuada', () => {
    expect(formatElapsed(12_000)).toMatch(/12/)
    expect(formatElapsed(3 * 60_000)).toMatch(/3 min/)
    expect(formatElapsed(2 * 3_600_000)).toMatch(/2 h/)
  })
})
