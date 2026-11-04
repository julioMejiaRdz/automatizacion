import { describe, expect, it } from 'vitest'
import { generateToken } from '../src/utils/token'
import { generateJWT, verifyJWT } from '../src/utils/jwt'
import { checkPassword, hashPassword } from '../src/utils/auth'

describe('generateToken', () => {
  it('genera un código de 6 dígitos', () => {
    for (let i = 0; i < 100; i++) expect(generateToken()).toMatch(/^\d{6}$/)
  })
})

describe('JWT', () => {
  it('verifica un token generado y devuelve el id', () => {
    const token = generateJWT('64b7f0c2a1b2c3d4e5f60718')
    expect(verifyJWT(token)).toEqual({ id: '64b7f0c2a1b2c3d4e5f60718' })
  })

  it('devuelve null con un token alterado', () => {
    expect(verifyJWT(generateJWT('abc') + 'x')).toBeNull()
  })
})

describe('hash de contraseñas', () => {
  it('acepta la contraseña correcta y rechaza otra', async () => {
    const hash = await hashPassword('password123')
    expect(await checkPassword('password123', hash)).toBe(true)
    expect(await checkPassword('otra-password', hash)).toBe(false)
  })
})
