import { Router } from 'express'

import { authGuard } from '../../middlewares/authGuard.js'
import * as controller from './controller.js'

const router: Router = Router()

router.get('/', authGuard, controller.list)
router.get('/:id', authGuard, controller.get)
router.post('/', authGuard, controller.create)
router.patch('/:id', authGuard, controller.update)
router.delete('/:id', authGuard, controller.remove)

export default router
