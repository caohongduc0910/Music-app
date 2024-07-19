import { Request, Response } from "express"
import Song from "../../models/song.model"
import Singer from "../../models/singer.model"

import convertToSlug from '../../helpers/convertToSlug'

export const index = async (req: Request, res: Response): Promise<void> => {
  const type = req.params.type

  const keyword: string = `${req.query.keyword}`
  let listSongs: any[] = []
  if (keyword) {
    const regexKeyword = new RegExp(keyword, "i")

    //tao slug tu ten nhap vao
    const generateSlug = convertToSlug(keyword)
    const regexSlug = new RegExp(generateSlug, "i")

    const songs = await Song.find({
      status: "active",
      deleted: false,
      $or: [
        { title: regexKeyword },
        { slug: regexSlug }
      ]
    })

    for (const song of songs) {
      const singerInfo = await Singer.findOne({
        _id: song.singerID,
        status: "active",
        deleted: false
      })

      if (singerInfo) {
        listSongs.push({
          title: song.title,
          avatar: song.avatar,
          slug: song.slug,
          like: song.like,
          singerName: singerInfo.fullName
        })
      }
      else {
        console.log(`Singer not found for song ID ${song._id}`)
      }
    }
  }

  if (type == "result") {
    res.render("client/pages/search/result.pug", {
      pageTitle: `Kết quả tìm kiếm ${keyword}`,
      keyword: keyword,
      songs: listSongs
    })
  }
  else {
    res.json({
      code: 200,
      songs: listSongs
    })
  }
}