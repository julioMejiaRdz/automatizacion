import type { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

/** Responde 400 con `{ errors }` si alguna validación de express-validator falló. */
export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}
