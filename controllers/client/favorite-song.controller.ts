import { Request, Response } from "express"
import FavoriteSong from '../../models/favorite-song.model'
import Song from '../../models/song.model'
import Singer from '../../models/singer.model'

export const getAll = async (req: Request, res: Response): Promise<void> => {

  const songs = await FavoriteSong.find({
    deleted: false
  })

  for (const song of songs) {
    const songInfo = await Song.findOne({
      _id: song.songID,
      status: "active",
      deleted: false
    })

    if (songInfo) {
      (song as any)["songInfo"] = songInfo
      const singerInfo = await Singer.findOne({
        _id: songInfo.singerID,
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
    else {
      console.log(`Song not found for song ID ${song._id}`)
    }
  }

  for(const song of songs) {
    console.log(song)
  }

  res.render("client/pages/favorite-songs/index.pug", {
    pageTitle: "Bài hát yêu thích",
    favoriteSongs: songs
  })
}