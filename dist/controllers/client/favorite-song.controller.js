"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = void 0;
const favorite_song_model_1 = __importDefault(require("../../models/favorite-song.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userID = null;
    if (res.locals.user) {
        userID = res.locals.user.id;
    }
    const songs = yield favorite_song_model_1.default.find({
        userID: userID,
        deleted: false,
    });
    for (const song of songs) {
        const songInfo = yield song_model_1.default.findOne({
            _id: song.songID,
            status: "active",
            deleted: false,
        });
        if (songInfo) {
            song["songInfo"] = songInfo;
            const singerInfo = yield singer_model_1.default.findOne({
                _id: songInfo.singerID,
                status: "active",
                deleted: false,
            });
            if (singerInfo) {
                song["singerInfo"] = singerInfo;
            }
            else {
                console.log(`Singer not found for song ID ${song._id}`);
            }
        }
        else {
            console.log(`Song not found for song ID ${song._id}`);
        }
    }
    res.render("client/pages/favorite-songs/index.pug", {
        pageTitle: "Bài hát yêu thích",
        favoriteSongs: songs,
    });
});
exports.getAll = getAll;
