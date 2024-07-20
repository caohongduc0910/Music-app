import { Router } from "express"
const router: Router = Router()

import multer from 'multer'
const upload = multer()

import * as uploadToCloud from '../../middlewares/cloudinary.middleware'
import * as controller from '../../controllers/admin/song.controller'

router.get("/", controller.index)

router.get("/create", controller.createGet)

router.post("/create",
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  uploadToCloud.uploadFields,
  controller.createPost
)

router.get("/edit/:id", controller.editGet)

router.patch("/edit/:id",
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  uploadToCloud.uploadFields,
  controller.editPost
)

export default router