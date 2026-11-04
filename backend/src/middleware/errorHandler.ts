import type { Request, Response, NextFunction } from 'express'

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Recurso no encontrado' })
}

/** Último middleware: registra el error y responde 500 sin filtrar detalles al cliente. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  if (res.headersSent) return
  if (err.message === 'Origen no permitido por CORS') {
    res.status(403).json({ error: err.message })
    return
  }
  res.status(500).json({ error: 'Hubo un error' })
}
