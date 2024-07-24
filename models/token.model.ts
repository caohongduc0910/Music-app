import { Schema, model } from "mongoose";

const tokenSchema = new Schema(
  {
    userID: String,
    token: String,
    "expireAt": {
      type: Date,
      expires: 12 * 3600
    }
  },
  {
    timestamps: true,
  }
);

const Token = model("Token", tokenSchema, "tokens");

export default Token;
