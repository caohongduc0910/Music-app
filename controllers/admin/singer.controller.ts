import { Request, Response } from "express"
import slug from "slug"

import Singer from "../../models/singer.model"
import prefixAdmin from "../../config/prefix.config"


export const index = async (req: Request, res: Response): Promise<void> => {
  const singers = await Singer.find({
    status: "active",
    deleted: false,
  })

  res.render("admin/pages/singers/index.pug", {
    pageTitle: "Danh sách ca sĩ",
    singers: singers
  })
}

export const createGet = async (req: Request, res: Response): Promise<void> => {
  res.render("admin/pages/singers/create.pug", {
    pageTitle: "Thêm mới ca sĩ",
  })
}

export const createPost = async (req: Request, res: Response): Promise<void> => {
  interface Singer {
    fullName: string,
    avatar: string,
    status: string,
    slug: string
  }
  
  const singer: Singer = {
    fullName: req.body.fullName,
    avatar: req.body.avatar,
    status: req.body.status,
    slug: slug(req.body.fullName)
  }
  
  const newSinger = new Singer(singer)
  await newSinger.save()

  res.redirect(`${prefixAdmin}/singers`)
}
