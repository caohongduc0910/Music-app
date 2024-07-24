import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const topic = await Topic.findOne({
    status: "active",
    deleted: false,
    slug: req.params.slugTopic,
  });

  const songs = await Song.find({
    status: "active",
    deleted: false,
    topicID: topic.id,
  });

  for (const song of songs) {
    const singerInfo = await Singer.findOne({
      _id: song.singerID,
      status: "active",
      deleted: false,
    });

    if (singerInfo) {
      (song as any)["singerInfo"] = singerInfo;
    } else {
      console.log(`Singer not found for song ID ${song._id}`);
    }
  }

  res.render("client/pages/songs/index.pug", {
    pageTitle: topic.title,
    songs: songs,
  });
};

export const detail = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug: string = req.params.slugSong;
    let userID: string = null;

    if (res.locals.user) {
      userID = res.locals.user.id;
    }

    const song = await Song.findOne({
      slug: slug,
      status: "active",
      deleted: false,
    });

    const items: any = song.like;
    const userList: string[] = [];
    let item: any;

    for (item of items) {
      userList.push(item.userID);
    }

    const topic = await Topic.findOne({
      _id: song.topicID,
      status: "active",
      deleted: false,
    });

    const singer = await Singer.findOne({
      _id: song.singerID,
      status: "active",
      deleted: false,
    });

    const favoriteSong = await FavoriteSong.findOne({
      userID: userID,
      songID: song.id,
      deleted: false,
    });

    if (favoriteSong) {
      (song as any)["isFavoriteSong"] = true;
    } else {
      (song as any)["isFavoriteSong"] = false;
    }

    if (userList.includes(userID)) {
      (song as any)["isLikeSong"] = true;
    } else {
      (song as any)["isLikeSong"] = false;
    }

    res.render("client/pages/songs/detail.pug", {
      pageTitle: song.title,
      song: song,
      topic: topic,
      singer: singer,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

export const like = async (req: Request, res: Response): Promise<void> => {
  try {
    const type = req.params.type;
    const songID = req.params.id;
    let userID: string = null;

    if (res.locals.user) {
      userID = res.locals.user.id;

      if (type == "yes") {
        await Song.updateOne(
          {
            _id: songID,
          },
          {
            $push: {
              like: {
                userID: userID,
              },
            },
          }
        );
      } else {
        await Song.updateOne(
          { _id: songID },
          {
            $pull: {
              like: { userID: userID },
            },
          }
        );
      }

      const song = await Song.findOne({
        _id: songID,
        deleted: false,
        status: "active",
      });

      res.json({
        code: 200,
        currentLike: song.like.length,
      });
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

export const favorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const type = req.params.type;
    const songID = req.params.id;
    let userID: string = null;

    if (res.locals.user) {
      userID = res.locals.user.id;
    }

    const favSong = await FavoriteSong.findOne({
      userID: userID,
      songID: songID,
      deleted: false,
    });

    if (type == "yes") {
      if (!favSong) {
        const newFavSong = new FavoriteSong({
          userID: userID,
          songID: songID,
        });
        await newFavSong.save();
        res.json({
          code: 200,
        });
      }
    } else {
      if (!favSong) {
        req.flash("fail", "Lỗi bài hát");
        res.redirect("back");
      } else {
        await favSong.deleteOne();
      }
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

export const listen = async (req: Request, res: Response): Promise<void> => {
  try {
    const songID = req.params.id;

    const song = await Song.findOne({
      _id: songID,
      deleted: false,
      status: "active",
    });

    let currentListen: number = song.listen + 1;

    await Song.updateOne(
      {
        _id: songID,
      },
      {
        listen: currentListen,
      }
    );

    res.json({
      code: 200,
      listen: currentListen,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};
