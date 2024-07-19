import { Request, Response } from "express"

export const home = async (req: Request, res: Response): Promise<void> => {
  res.render("admin/pages/home/index.pug", {
    pageTitle: "Trang chủ"
  })
}