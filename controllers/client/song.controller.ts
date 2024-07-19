import { Request, Response } from "express"
import Topic from "../../models/topic.model"
import Song from "../../models/song.model"
import Singer from "../../models/singer.model"
import FavoriteSong from "../../models/favorite-song.model"

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const topic = await Topic.findOne({
    status: "active",
    deleted: false,
    slug: req.params.slugTopic
  })

  const songs = await Song.find({
    status: "active",
    deleted: false,
    topicID: topic.id
  })

  for (const song of songs) {
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

  res.render("client/pages/songs/index.pug", {
    pageTitle: topic.title,
    songs: songs
  })
}


export const detail = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slugSong

    const song = await Song.findOne({
      slug: slug,
      status: "active",
      deleted: false
    })

    const topic = await Topic.findOne({
      _id: song.topicID,
      status: "active",
      deleted: false
    })

    const singer = await Singer.findOne({
      _id: song.singerID,
      status: "active",
      deleted: false
    })

    const favoriteSong = await FavoriteSong.findOne({
      songID: song.id,
      deleted: false
    })

    if (favoriteSong) {
      (song as any)['isFavoriteSong'] = true
    }
    else {
      (song as any)['isFavoriteSong'] = false
    }

    res.render("client/pages/songs/detail.pug", {
      pageTitle: song.title,
      song: song,
      topic: topic,
      singer: singer
    })
  }
  catch (error) {
    console.log(error)
    return
  }
}


export const like = async (req: Request, res: Response): Promise<void> => {
  try {
    const type = req.params.type
    const songID = req.params.id

    const song = await Song.findOne({
      _id: songID,
      deleted: false,
      status: 'active'
    })

    let currentLike: number = song.like
    type == "yes" ? ++currentLike : --currentLike

    await Song.updateOne({
      _id: songID
    }, {
      like: currentLike
    })

    res.json({
      code: 200,
      currentLike: currentLike
    })
  }
  catch (error) {
    console.log(error)
    return
  }
}


export const favorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const type = req.params.type
    const songID = req.params.id
    console.log(type, songID)

    if (type == 'yes') {
      const favSong = await FavoriteSong.findOne({
        songID: songID,
        deleted: false
      })

      if (!favSong) {
        const newFavSong = new FavoriteSong({
          songID: songID
        })
        await newFavSong.save()
      }
    }
    else {
      const favSong = await FavoriteSong.findOne({
        songID: songID,
        deleted: false
      })

      if (!favSong) {
        res.json({
          code: 404
        })
      }
      else {
        await favSong.deleteOne();
      }
    }
    res.json({
      code: 200
    })
  }
  catch (error) {
    console.log(error)
    return
  }
}


export const listen = async (req: Request, res: Response): Promise<void> => {
  try {
    const songID = req.params.id

    const song = await Song.findOne({
      _id: songID,
      deleted: false,
      status: 'active'
    })

    let currentListen: number = song.listen + 1

    await Song.updateOne({
      _id: songID
    }, {
      listen: currentListen
    })

    res.json({
      code: 200,
      listen: currentListen
    })
  }
  catch (error) {
    console.log(error)
    return
  }
}