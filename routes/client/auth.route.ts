import { Router } from "express"
const router: Router = Router()

import * as controller from '../../controllers/client/auth.controller'

router.get("/login", controller.loginGet)

router.get("/register", controller.registerGet)

export default router