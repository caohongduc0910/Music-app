import { Request, Response } from "express"
import Song from "../../models/song.model"
import Topic from "../../models/topic.model"
import Singer from "../../models/singer.model"

import prefixAdmin from "../../config/prefix.config"

export const index = async (req: Request, res: Response): Promise<void> => {
  const songs = await Song.find({
    status: "active",
    deleted: false,
  })

  for (const song of songs) {
    const topicInfo = await Topic.findOne({
      _id: song.topicID,
      status: "active",
      deleted: false
    })

    if (topicInfo) {
      (song as any)["topicInfo"] = topicInfo
    }
    else {
      console.log(`Topic not found for song ID ${song._id}`)
    }

    const singerInfo = await Singer.findOne({
      _id: song.singerID,
      status: "active",
      deleted: false
    })

    if (singerInfo) {
      (song as any)["singerInfo"] = singerInfo
    }
    else {
      console.log(`Singer not found for song ID ${song._id}`)
    }
  }

  res.render("admin/pages/songs/index.pug", {
    pageTitle: "Danh sách bài hát",
    songs: songs
  })
}


export const createGet = async (req: Request, res: Response): Promise<void> => {
  const topics = await Topic.find({
    status: "active",
    deleted: false,
  })

  const singers = await Singer.find({
    status: "active",
    deleted: false,
  })

  res.render("admin/pages/songs/create.pug", {
    pageTitle: "Tạo mới bài hát",
    topics: topics,
    singers: singers
  })
}


export const createPost = async (req: Request, res: Response): Promise<void> => {
  // if (req.body.avatar) {
  //   req.body.avatar = req.body.avatar[0]
  // }

  // if (req.body.audio) {
  //   req.body.audio = req.body.audio[0]
  // }

  interface songObject {
    title: string,
    topicID: string,
    singerID: string,
    lyrics: string,
    description: string,
    status: string,
    avatar: string
  }

  const songPost: songObject = {
    title: req.body.title,
    topicID: req.body.topicID,
    singerID: req.body.singerID,
    lyrics: req.body.lyrics,
    description: req.body.description,
    status: req.body.status,
    avatar: req.body.avatar
  }

  const song = new Song(songPost)
  await song.save()

  res.redirect(`${prefixAdmin}/songs`)
}