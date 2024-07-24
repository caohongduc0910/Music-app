import { Router } from "express";
const router: Router = Router();

import multer from "multer";
const upload = multer();

import * as controller from "../../controllers/admin/singer.controller";
import * as uploadToCloud from "../../middlewares/cloudinary.middleware";

router.get("/", controller.index);

router.get("/create", controller.createGet);

router.post(
  "/create",
  upload.single("avatar"),
  uploadToCloud.uploadSingle,
  controller.createPost
);

export default router;
