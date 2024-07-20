import { Request, Response } from "express"

import Singer from "../../models/singer.model"

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