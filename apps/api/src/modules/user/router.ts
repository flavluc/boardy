import { Router } from 'express'

import * as controller from './controller.js'

const router: Router = Router()

router.get('/', controller.list)
router.get('/:id', controller.get)
router.patch('/:id', controller.update)
router.delete('/:id', controller.remove)

export default router
