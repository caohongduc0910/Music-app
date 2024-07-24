import { Router } from "express"
const router: Router = Router()

import * as controller from '../../controllers/client/auth.controller'

import authToken from "../../middlewares/auth.middleware"


router.get("/register", controller.registerGet)

router.post("/register", controller.registerPost)

router.get("/confirm", controller.confirmGet)

router.get("/login", controller.loginGet)

router.post("/login", controller.loginPost)

router.get("/logout", authToken, controller.logoutGet)

export default router