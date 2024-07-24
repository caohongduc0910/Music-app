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
exports.editPost = exports.editGet = exports.createPost = exports.createGet = exports.index = void 0;
const slug_1 = __importDefault(require("slug"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const prefix_config_1 = __importDefault(require("../../config/prefix.config"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songs = yield song_model_1.default.find({
        status: "active",
        deleted: false,
    });
    for (const song of songs) {
        const topicInfo = yield topic_model_1.default.findOne({
            _id: song.topicID,
            status: "active",
            deleted: false
        });
        if (topicInfo) {
            song["topicInfo"] = topicInfo;
        }
        else {
            console.log(`Topic not found for song ID ${song._id}`);
        }
        const singerInfo = yield singer_model_1.default.findOne({
            _id: song.singerID,
            status: "active",
            deleted: false
        });
        if (singerInfo) {
            song["singerInfo"] = singerInfo;
        }
        else {
            console.log(`Singer not found for song ID ${song._id}`);
        }
    }
    res.render("admin/pages/songs/index.pug", {
        pageTitle: "Danh sách bài hát",
        songs: songs
    });
});
exports.index = index;
const createGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topics = yield topic_model_1.default.find({
        status: "active",
        deleted: false,
    });
    const singers = yield singer_model_1.default.find({
        status: "active",
        deleted: false,
    });
    res.render("admin/pages/songs/create.pug", {
        pageTitle: "Tạo mới bài hát",
        topics: topics,
        singers: singers
    });
});
exports.createGet = createGet;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songPost = {
        title: req.body.title,
        topicID: req.body.topicID,
        singerID: req.body.singerID,
        lyrics: req.body.lyrics,
        description: req.body.description,
        status: req.body.status,
        avatar: req.body.avatar,
        audio: req.body.audio,
        slug: (0, slug_1.default)(req.body.title)
    };
    const song = new song_model_1.default(songPost);
    yield song.save();
    res.redirect(`${prefix_config_1.default}/songs`);
});
exports.createPost = createPost;
const editGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songID = req.params.id;
    const song = yield song_model_1.default.findOne({
        _id: songID,
        status: "active",
        deleted: false,
    });
    const topics = yield topic_model_1.default.find({
        status: "active",
        deleted: false,
    });
    const singers = yield singer_model_1.default.find({
        status: "active",
        deleted: false,
    });
    res.render("admin/pages/songs/edit.pug", {
        pageTitle: "Chỉnh sửa bài hát",
        song: song,
        topics: topics,
        singers: singers
    });
});
exports.editGet = editGet;
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songID = req.params.id;
    const song = {
        title: req.body.title,
        topicID: req.body.topicID,
        singerID: req.body.singerID,
        lyrics: req.body.lyrics,
        description: req.body.description,
        status: req.body.status,
        avatar: req.body.avatar,
        audio: req.body.audio,
        slug: (0, slug_1.default)(req.body.title)
    };
    yield song_model_1.default.updateOne({
        _id: songID
    }, song);
    res.redirect(`${prefix_config_1.default}/songs/edit/${songID}`);
});
exports.editPost = editPost;
