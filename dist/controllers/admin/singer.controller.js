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
exports.createPost = exports.createGet = exports.index = void 0;
const slug_1 = __importDefault(require("slug"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const prefix_config_1 = __importDefault(require("../../config/prefix.config"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const singers = yield singer_model_1.default.find({
        status: "active",
        deleted: false,
    });
    res.render("admin/pages/singers/index.pug", {
        pageTitle: "Danh sách ca sĩ",
        singers: singers
    });
});
exports.index = index;
const createGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/singers/create.pug", {
        pageTitle: "Thêm mới ca sĩ",
    });
});
exports.createGet = createGet;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const singer = {
        fullName: req.body.fullName,
        avatar: req.body.avatar,
        status: req.body.status,
        slug: (0, slug_1.default)(req.body.fullName)
    };
    const newSinger = new singer_model_1.default(singer);
    yield newSinger.save();
    res.redirect(`${prefix_config_1.default}/singers`);
});
exports.createPost = createPost;
