import { randomInt } from 'node:crypto'

/** Código numérico de 6 dígitos para confirmar cuentas y restablecer contraseñas. */
export const generateToken = () => randomInt(100000, 1000000).toString()
