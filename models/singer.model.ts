import { Schema, model } from "mongoose"

const singerSchema = new Schema(
  {
    fullName: String,
    avatar: String,
    status: String,
    slug: {
      type: String,
      slug: "fullName",
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
)

const Singer = model("Singer", singerSchema, "singers")

export default Singer