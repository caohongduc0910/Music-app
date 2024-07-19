import { Router } from "express"
const router: Router = Router()

import * as controller from '../../controllers/client/song.controller'

router.get("/:slugTopic", controller.getAll)

router.get("/detail/:slugSong", controller.detail)

router.patch("/like/:type/:id", controller.like)

router.patch("/favorite/:type/:id", controller.favorite)

router.patch("/listen/:id", controller.listen)

export default router