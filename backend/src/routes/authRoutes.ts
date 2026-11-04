import { Router } from 'express'
import { body, param } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'
import { authenticate } from '../middleware/auth'
import { authLimiter } from '../middleware/rateLimit'

const router = Router()

const passwordRules = [
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña es muy corta, mínimo 8 caracteres'),
  body('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Las contraseñas no son iguales')
    return true
  }),
]

const tokenRule = body('token')
  .isLength({ min: 6, max: 6 })
  .isNumeric()
  .withMessage('El código debe tener 6 dígitos')

router.post(
  '/create-account',
  authLimiter,
  body('name').trim().notEmpty().withMessage('El nombre no puede ir vacío'),
  body('email').isEmail().withMessage('E-mail no válido').normalizeEmail(),
  ...passwordRules,
  handleInputErrors,
  AuthController.createAccount,
)

router.post(
  '/confirm-account',
  authLimiter,
  tokenRule,
  handleInputErrors,
  AuthController.confirmAccount,
)

router.post(
  '/login',
  authLimiter,
  body('email').isEmail().withMessage('E-mail no válido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña no puede ir vacía'),
  handleInputErrors,
  AuthController.login,
)

router.post(
  '/request-code',
  authLimiter,
  body('email').isEmail().withMessage('E-mail no válido').normalizeEmail(),
  handleInputErrors,
  AuthController.requestConfirmationCode,
)

router.post(
  '/forgot-password',
  authLimiter,
  body('email').isEmail().withMessage('E-mail no válido').normalizeEmail(),
  handleInputErrors,
  AuthController.forgotPassword,
)

router.post(
  '/validate-token',
  authLimiter,
  tokenRule,
  handleInputErrors,
  AuthController.validateToken,
)

router.post(
  '/update-password/:token',
  authLimiter,
  param('token').isLength({ min: 6, max: 6 }).isNumeric().withMessage('Código no válido'),
  ...passwordRules,
  handleInputErrors,
  AuthController.updatePasswordWithToken,
)

// ─── Rutas del usuario autenticado ──────────────────────────────
router.get('/user', authenticate, AuthController.user)

router.put(
  '/profile',
  authenticate,
  body('name').trim().notEmpty().withMessage('El nombre no puede ir vacío'),
  body('email').isEmail().withMessage('E-mail no válido').normalizeEmail(),
  handleInputErrors,
  AuthController.updateProfile,
)

router.post(
  '/update-password',
  authenticate,
  body('current_password').notEmpty().withMessage('La contraseña actual no puede ir vacía'),
  ...passwordRules,
  handleInputErrors,
  AuthController.updateCurrentUserPassword,
)

router.post(
  '/check-password',
  authenticate,
  authLimiter,
  body('password').notEmpty().withMessage('La contraseña no puede ir vacía'),
  handleInputErrors,
  AuthController.checkPassword,
)

export default router
