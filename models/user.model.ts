import { Schema, model } from "mongoose"

const userSchema = new Schema(
  {
    email: String,
    password: String,
    name: String,
    dob: String,
    status: {
      type: String,
      default: "inactive"
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

const User = model("User", userSchema, "users")

export default User