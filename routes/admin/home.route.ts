import { Router } from "express"
const router: Router = Router()

import * as controller from '../../controllers/admin/home.controller'

router.get("/", controller.home)

export default router