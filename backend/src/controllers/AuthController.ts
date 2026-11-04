import type { Request, Response } from 'express'
import type { Types } from 'mongoose'
import User, { type UserDocument } from '../models/User'
import Token from '../models/Token'
import { AuthEmail } from '../emails/AuthEmail'
import { getAuthUser } from '../middleware/auth'
import { checkPassword, hashPassword } from '../utils/auth'
import { generateJWT } from '../utils/jwt'
import { generateToken } from '../utils/token'

// Express 5 envía al errorHandler cualquier excepción de un controlador async,
// por eso aquí no hay try/catch.

/** Reemplaza cualquier código previo del usuario por uno nuevo y lo devuelve. */
const createUserToken = async (userId: Types.ObjectId) => {
  await Token.deleteMany({ user: userId })
  const token = await Token.create({ user: userId, token: generateToken() })
  return token.token
}

const sendConfirmation = async (user: UserDocument) => {
  const token = await createUserToken(user._id)
  await AuthEmail.sendConfirmationEmail({ email: user.email, name: user.name, token })
}

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    const { name, email, password } = req.body

    const userExists = await User.exists({ email })
    if (userExists) {
      return res.status(409).json({ error: 'El correo electrónico ya está asociado a una cuenta' })
    }

    const user = await User.create({ name, email, password: await hashPassword(password) })
    await sendConfirmation(user)

    res.status(201).send('Cuenta creada, revisa tu email para confirmarla')
  }

  static confirmAccount = async (req: Request, res: Response) => {
    const tokenExists = await Token.findOne({ token: req.body.token })
    if (!tokenExists) {
      return res.status(404).json({ error: 'Código no válido o expirado' })
    }

    await Promise.all([
      User.updateOne({ _id: tokenExists.user }, { confirmed: true }),
      tokenExists.deleteOne(),
    ])

    res.send('Cuenta confirmada exitosamente')
  }

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    if (!user.confirmed) {
      await sendConfirmation(user)
      return res
        .status(401)
        .json({ error: 'La cuenta no ha sido confirmada, te enviamos un nuevo código por email' })
    }

    const isPasswordCorrect = await checkPassword(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Contraseña incorrecta' })
    }

    res.send(generateJWT(user._id))
  }

  static requestConfirmationCode = async (req: Request, res: Response) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(404).json({ error: 'El usuario no está registrado' })
    }
    if (user.confirmed) {
      return res.status(403).json({ error: 'El usuario ya está confirmado' })
    }

    await sendConfirmation(user)
    res.send('Se envió un nuevo código a tu email')
  }

  static forgotPassword = async (req: Request, res: Response) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(404).json({ error: 'El usuario no está registrado' })
    }

    const token = await createUserToken(user._id)
    await AuthEmail.sendPasswordResetToken({ email: user.email, name: user.name, token })

    res.send('Revisa tu email para las instrucciones')
  }

  static validateToken = async (req: Request, res: Response) => {
    const tokenExists = await Token.exists({ token: req.body.token })
    if (!tokenExists) {
      return res.status(404).json({ error: 'Código no válido o expirado' })
    }
    res.send('Código válido, ingresa tu nueva contraseña')
  }

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    const tokenExists = await Token.findOne({ token: req.params.token })
    if (!tokenExists) {
      return res.status(404).json({ error: 'Código no válido o expirado' })
    }

    await Promise.all([
      User.updateOne(
        { _id: tokenExists.user },
        { password: await hashPassword(req.body.password) },
      ),
      tokenExists.deleteOne(),
    ])

    res.send('Contraseña modificada correctamente')
  }

  static user = async (req: Request, res: Response) => {
    res.json(getAuthUser(req))
  }

  static updateProfile = async (req: Request, res: Response) => {
    const user = getAuthUser(req)
    const { name, email } = req.body

    const userExists = await User.findOne({ email })
    if (userExists && !userExists._id.equals(user._id)) {
      return res.status(409).json({ error: 'El email ya está registrado' })
    }

    user.name = name
    user.email = email
    await user.save()

    res.send('Perfil actualizado correctamente')
  }

  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    const { current_password, password } = req.body

    const user = await User.findById(getAuthUser(req)._id)
    if (!user || !(await checkPassword(current_password, user.password))) {
      return res.status(401).json({ error: 'La contraseña actual no es correcta' })
    }

    user.password = await hashPassword(password)
    await user.save()

    res.send('Contraseña actualizada correctamente')
  }

  static checkPassword = async (req: Request, res: Response) => {
    const user = await User.findById(getAuthUser(req)._id)
    if (!user || !(await checkPassword(req.body.password, user.password))) {
      return res.status(401).json({ error: 'La contraseña no es correcta' })
    }
    res.send('Contraseña correcta')
  }
}
