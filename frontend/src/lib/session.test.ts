import { afterEach, describe, expect, it, vi } from 'vitest'
import { AUTH_TOKEN_KEY } from './config'
import { expireSession, SESSION_EXPIRED_KEY } from './session'

describe('expireSession', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('borra el token, deja el aviso y lleva al login', () => {
    window.history.replaceState(null, '', '/profile')
    const replace = vi.spyOn(window.location, 'replace').mockImplementation(() => {})
    localStorage.setItem(AUTH_TOKEN_KEY, 'token-vencido')

    expireSession()

    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
    expect(localStorage.getItem(SESSION_EXPIRED_KEY)).toBe('1')
    expect(replace).toHaveBeenCalledWith('/auth/login')
  })

  it('no hace nada en las vistas de autenticación (ahí un 401 es una contraseña incorrecta)', () => {
    window.history.replaceState(null, '', '/auth/login')
    const replace = vi.spyOn(window.location, 'replace').mockImplementation(() => {})
    localStorage.setItem(AUTH_TOKEN_KEY, 'token')

    expireSession()

    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe('token')
    expect(replace).not.toHaveBeenCalled()
  })
})
