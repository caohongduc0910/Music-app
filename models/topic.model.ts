import { Schema, model } from "mongoose"

const topicSchema = new Schema(
  {
    title: String,
    avatar: String,
    description: String,
    status: String,
    slug: {
      type: String,
      slug: "title",
      unique: true
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
);

const Topic = model("Topic", topicSchema, "topics")

export default Topic