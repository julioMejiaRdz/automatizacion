import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/server'

// Estas pruebas no tocan MongoDB: cubren rutas que responden antes de consultar la base.
const app = createApp()

describe('API', () => {
  it('GET /api/health responde ok', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })

  it('valida el body del login', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'no-es-email' })
    expect(res.status).toBe(400)
    expect(res.body.errors).toHaveLength(2)
  })

  it('rechaza rutas protegidas sin token', async () => {
    const res = await request(app).get('/api/auth/user')
    expect(res.status).toBe(401)
  })

  it('rechaza un token inválido', async () => {
    const res = await request(app).get('/api/devices').set('Authorization', 'Bearer invalido')
    expect(res.status).toBe(401)
  })

  it('bloquea orígenes no permitidos por CORS', async () => {
    const res = await request(app).get('/api/health').set('Origin', 'http://evil.example')
    expect(res.status).toBe(403)
  })

  it('permite el origen configurado en FRONTEND_URL', async () => {
    const res = await request(app).get('/api/health').set('Origin', 'http://localhost:5173')
    expect(res.status).toBe(200)
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173')
  })

  it('permite peticiones del mismo origen (frontend y API detrás de Nginx)', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Host', '192.168.1.50:8080')
      .set('Origin', 'http://192.168.1.50:8080')
    expect(res.status).toBe(200)
  })

  it('rechaza un origen con el mismo host pero otro puerto', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Host', '192.168.1.50')
      .set('Origin', 'http://192.168.1.50:8080')
    expect(res.status).toBe(403)
  })

  it('responde 404 en rutas inexistentes', async () => {
    const res = await request(app).get('/api/no-existe')
    expect(res.status).toBe(404)
  })
})
