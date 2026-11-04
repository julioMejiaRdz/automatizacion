import { Router } from 'express'
import { body, param } from 'express-validator'
import { DeviceController } from '../controllers/DeviceController'
import { authenticate } from '../middleware/auth'
import { handleInputErrors } from '../middleware/validation'

const router = Router()

router.use(authenticate)

const idParam = param('id').trim().notEmpty().withMessage('ID no válido')

const deviceRules = [
  body('name').trim().notEmpty().withMessage('El nombre no puede ir vacío'),
  body('topic')
    .trim()
    .notEmpty()
    .withMessage('El topic no puede ir vacío')
    .not()
    .matches(/[+#]/)
    .withMessage('El topic no puede contener comodines (+ o #)'),
  body('fields').optional().isArray().withMessage('fields debe ser un arreglo'),
  body('fields.*.key').trim().notEmpty().withMessage('Cada campo necesita una key'),
  body('fields.*.label').optional().trim(),
  body('fields.*.unit').optional().trim(),
]

router.get('/', DeviceController.getAll)

router.get('/:id', idParam, handleInputErrors, DeviceController.getById)

router.post(
  '/',
  body('id').trim().notEmpty().withMessage('El ID no puede ir vacío'),
  ...deviceRules,
  handleInputErrors,
  DeviceController.create,
)

router.put('/:id', idParam, ...deviceRules, handleInputErrors, DeviceController.update)

router.delete('/:id', idParam, handleInputErrors, DeviceController.remove)

export default router
