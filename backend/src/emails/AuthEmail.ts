import { transporter } from '../config/mailer'
import { env } from '../config/env'
import { TOKEN_TTL_MINUTES } from '../models/Token'

type EmailData = {
  email: string
  name: string
  token: string
}

const layout = (title: string, body: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #0f172a">
    <h2 style="color: #0f766e">${title}</h2>
    ${body}
    <p style="color: #64748b; font-size: 12px">El código expira en ${TOKEN_TTL_MINUTES} minutos.
    Si no solicitaste este correo, puedes ignorarlo.</p>
  </div>`

const code = (token: string) =>
  `<p style="font-size: 28px; font-weight: bold; letter-spacing: 6px">${token}</p>`

export class AuthEmail {
  static sendConfirmationEmail = async ({ email, name, token }: EmailData) => {
    await transporter.sendMail({
      from: env.MAIL_FROM,
      to: email,
      subject: 'Confirma tu cuenta',
      text: `Hola ${name}, tu código de confirmación es ${token}. Ingrésalo en ${env.FRONTEND_URL}/auth/confirm-account`,
      html: layout(
        'Confirma tu cuenta',
        `<p>Hola ${name}, ingresa este código en
        <a href="${env.FRONTEND_URL}/auth/confirm-account">${env.FRONTEND_URL}/auth/confirm-account</a>:</p>
        ${code(token)}`,
      ),
    })
  }

  static sendPasswordResetToken = async ({ email, name, token }: EmailData) => {
    await transporter.sendMail({
      from: env.MAIL_FROM,
      to: email,
      subject: 'Restablece tu contraseña',
      text: `Hola ${name}, tu código para restablecer la contraseña es ${token}. Ingrésalo en ${env.FRONTEND_URL}/auth/new-password`,
      html: layout(
        'Restablece tu contraseña',
        `<p>Hola ${name}, ingresa este código en
        <a href="${env.FRONTEND_URL}/auth/new-password">${env.FRONTEND_URL}/auth/new-password</a>:</p>
        ${code(token)}`,
      ),
    })
  }
}
