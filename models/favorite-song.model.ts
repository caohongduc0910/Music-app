import {Schema, model} from "mongoose";

const favoriteSongSchema = new Schema(
  {
    userID: String,
    songID: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const FavoriteSong = model("FavoriteSong", favoriteSongSchema, "favorite-songs");

export default FavoriteSong;