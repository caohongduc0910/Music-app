import { Request, Response } from "express"
import slug from "slug"

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

  interface songObject {
    title: string,
    topicID: string,
    singerID: string,
    lyrics: string,
    description: string,
    status: string,
    avatar: string,
    audio: string,
    slug: string
  }

  const songPost: songObject = {
    title: req.body.title,
    topicID: req.body.topicID,
    singerID: req.body.singerID,  
    lyrics: req.body.lyrics,
    description: req.body.description,
    status: req.body.status,
    avatar: req.body.avatar,
    audio: req.body.audio,
    slug: slug(req.body.title)
  }

  const song = new Song(songPost)
  await song.save()

  res.redirect(`${prefixAdmin}/songs`)
}


export const editGet = async (req: Request, res: Response): Promise<void> => {

  const songID: string = req.params.id

  const song = await Song.findOne({
    _id: songID,
    status: "active",
    deleted: false,
  })

  const topics = await Topic.find({
    status: "active",
    deleted: false,
  })

  const singers = await Singer.find({
    status: "active",
    deleted: false,
  })

  res.render("admin/pages/songs/edit.pug", {
    pageTitle: "Chỉnh sửa bài hát",
    song: song,
    topics: topics,
    singers: singers
  })
}


export const editPost = async (req: Request, res: Response): Promise<void> => {

  const songID: string = req.params.id

  interface songObject {
    title: string,
    topicID: string,
    singerID: string,
    lyrics: string,
    description: string,
    status: string,
    avatar: string,
    audio: string,
    slug: string
  }

  const song: songObject = {
    title: req.body.title,
    topicID: req.body.topicID,
    singerID: req.body.singerID,  
    lyrics: req.body.lyrics,
    description: req.body.description,
    status: req.body.status,
    avatar: req.body.avatar,
    audio: req.body.audio,
    slug: slug(req.body.title)
  }

  await Song.updateOne({
    _id: songID
  }, song)

  res.redirect(`${prefixAdmin}/songs/edit/${songID}`)
}