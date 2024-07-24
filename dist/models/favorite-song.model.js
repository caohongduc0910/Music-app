"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const favoriteSongSchema = new mongoose_1.Schema({
    userID: String,
    songID: String,
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
}, {
    timestamps: true,
});
const FavoriteSong = (0, mongoose_1.model)("FavoriteSong", favoriteSongSchema, "favorite-songs");
exports.default = FavoriteSong;
