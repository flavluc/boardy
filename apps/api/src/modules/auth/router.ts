import { Router } from 'express'

import { authGuard } from '../../middlewares/authGuard.js'
import * as controller from './controller'

const router: Router = Router()

router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/refresh', controller.refresh)
router.get('/me', authGuard, controller.me)
router.post('/logout', controller.logout)

export default router
