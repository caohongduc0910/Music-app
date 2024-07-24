"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const songSchema = new mongoose_1.Schema({
    title: String,
    avatar: String,
    description: String,
    singerID: String,
    topicID: String,
    like: [{
            userID: String,
        }],
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
}, {
    timestamps: true,
});
const Song = (0, mongoose_1.model)("Song", songSchema, "songs");
exports.default = Song;
