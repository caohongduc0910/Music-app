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
exports.listen = exports.favorite = exports.like = exports.detail = exports.getAll = void 0;
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const favorite_song_model_1 = __importDefault(require("../../models/favorite-song.model"));
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topic = yield topic_model_1.default.findOne({
        status: "active",
        deleted: false,
        slug: req.params.slugTopic,
    });
    const songs = yield song_model_1.default.find({
        status: "active",
        deleted: false,
        topicID: topic.id,
    });
    for (const song of songs) {
        const singerInfo = yield singer_model_1.default.findOne({
            _id: song.singerID,
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
    res.render("client/pages/songs/index.pug", {
        pageTitle: topic.title,
        songs: songs,
    });
});
exports.getAll = getAll;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = req.params.slugSong;
        let userID = null;
        if (res.locals.user) {
            userID = res.locals.user.id;
        }
        const song = yield song_model_1.default.findOne({
            slug: slug,
            status: "active",
            deleted: false,
        });
        const items = song.like;
        const userList = [];
        let item;
        for (item of items) {
            userList.push(item.userID);
        }
        const topic = yield topic_model_1.default.findOne({
            _id: song.topicID,
            status: "active",
            deleted: false,
        });
        const singer = yield singer_model_1.default.findOne({
            _id: song.singerID,
            status: "active",
            deleted: false,
        });
        const favoriteSong = yield favorite_song_model_1.default.findOne({
            userID: userID,
            songID: song.id,
            deleted: false,
        });
        if (favoriteSong) {
            song["isFavoriteSong"] = true;
        }
        else {
            song["isFavoriteSong"] = false;
        }
        if (userList.includes(userID)) {
            song["isLikeSong"] = true;
        }
        else {
            song["isLikeSong"] = false;
        }
        res.render("client/pages/songs/detail.pug", {
            pageTitle: song.title,
            song: song,
            topic: topic,
            singer: singer,
        });
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports.detail = detail;
const like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.params.type;
        const songID = req.params.id;
        let userID = null;
        if (res.locals.user) {
            userID = res.locals.user.id;
            if (type == "yes") {
                yield song_model_1.default.updateOne({
                    _id: songID,
                }, {
                    $push: {
                        like: {
                            userID: userID,
                        },
                    },
                });
            }
            else {
                yield song_model_1.default.updateOne({ _id: songID }, {
                    $pull: {
                        like: { userID: userID },
                    },
                });
            }
            const song = yield song_model_1.default.findOne({
                _id: songID,
                deleted: false,
                status: "active",
            });
            res.json({
                code: 200,
                currentLike: song.like.length,
            });
        }
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports.like = like;
const favorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.params.type;
        const songID = req.params.id;
        let userID = null;
        if (res.locals.user) {
            userID = res.locals.user.id;
        }
        const favSong = yield favorite_song_model_1.default.findOne({
            userID: userID,
            songID: songID,
            deleted: false,
        });
        if (type == "yes") {
            if (!favSong) {
                const newFavSong = new favorite_song_model_1.default({
                    userID: userID,
                    songID: songID,
                });
                yield newFavSong.save();
                res.json({
                    code: 200,
                });
            }
        }
        else {
            if (!favSong) {
                req.flash("fail", "Lỗi bài hát");
                res.redirect("back");
            }
            else {
                yield favSong.deleteOne();
            }
        }
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports.favorite = favorite;
const listen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songID = req.params.id;
        const song = yield song_model_1.default.findOne({
            _id: songID,
            deleted: false,
            status: "active",
        });
        let currentListen = song.listen + 1;
        yield song_model_1.default.updateOne({
            _id: songID,
        }, {
            listen: currentListen,
        });
        res.json({
            code: 200,
            listen: currentListen,
        });
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports.listen = listen;
