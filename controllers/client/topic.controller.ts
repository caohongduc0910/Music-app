import { Request, Response } from "express"
import Topic from "../../models/topic.model"

export const index = async (req: Request, res: Response): Promise<void> => {
  const topics = await Topic.find({
    status: "active",
    deleted: false,
  })

  res.render("client/pages/topics/index.pug", {
    pageTitle: "Chủ đề bài hát",
    topics: topics
  })
}