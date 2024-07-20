import { Request, Response } from "express"

// import Song from "../../models/song.model"
// import Topic from "../../models/topic.model"
// import Singer from "../../models/singer.model"

export const loginGet = async (req: Request, res: Response): Promise<void> => {
  res.render("client/pages/auth/login.pug")
}

export const registerGet = async (req: Request, res: Response): Promise<void> => {
  res.render("client/pages/auth/register.pug")
}
