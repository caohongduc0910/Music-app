import { Schema, model } from "mongoose"
// import slug from "mongoose-slug-updater"

// mongoose.plugin(slug)

const songSchema = new Schema(
  {
    title: String,
    avatar: String,
    description: String,
    singerID: String,
    topicID: String,
    like: {
      type: Number,
      default: 0
    },
    lyrics: String,
    audio: String,
    status: String,
    slug: {
      type: String,
      unique: true
    },
    listen: {
      type: Number,
      default: 0
    },
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

const Song = model("Song", songSchema, "songs");

export default Song;