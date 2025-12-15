import { Router } from 'express'

import { authGuard } from '../../middlewares/authGuard'
import * as controller from './controller'

const router: Router = Router()

router.get('/me', authGuard, controller.get)
router.patch('/me', authGuard, controller.update)
router.delete('/me', authGuard, controller.remove)

export default router
