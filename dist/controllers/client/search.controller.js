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
exports.index = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const convertToSlug_1 = __importDefault(require("../../helpers/convertToSlug"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.params.type;
    const keyword = `${req.query.keyword}`;
    let listSongs = [];
    if (keyword) {
        const regexKeyword = new RegExp(keyword, "i");
        const generateSlug = (0, convertToSlug_1.default)(keyword);
        const regexSlug = new RegExp(generateSlug, "i");
        const songs = yield song_model_1.default.find({
            status: "active",
            deleted: false,
            $or: [
                { title: regexKeyword },
                { slug: regexSlug }
            ]
        });
        for (const song of songs) {
            const singerInfo = yield singer_model_1.default.findOne({
                _id: song.singerID,
                status: "active",
                deleted: false
            });
            if (singerInfo) {
                listSongs.push({
                    title: song.title,
                    avatar: song.avatar,
                    slug: song.slug,
                    like: song.like,
                    singerName: singerInfo.fullName
                });
            }
            else {
                console.log(`Singer not found for song ID ${song._id}`);
            }
        }
    }
    if (type == "result") {
        res.render("client/pages/search/result.pug", {
            pageTitle: `Kết quả tìm kiếm ${keyword}`,
            keyword: keyword,
            songs: listSongs
        });
    }
    else {
        res.json({
            code: 200,
            songs: listSongs
        });
    }
});
exports.index = index;
