"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const home_route_1 = __importDefault(require("./home.route"));
const topic_route_1 = __importDefault(require("./topic.route"));
const song_route_1 = __importDefault(require("./song.route"));
const singer_route_1 = __importDefault(require("./singer.route"));
const prefix_config_1 = __importDefault(require("../../config/prefix.config"));
const router = (0, express_1.Router)();
router.use(`${prefix_config_1.default}/home`, home_route_1.default);
router.use(`${prefix_config_1.default}/topics`, topic_route_1.default);
router.use(`${prefix_config_1.default}/songs`, song_route_1.default);
router.use(`${prefix_config_1.default}/singers`, singer_route_1.default);
exports.default = router;
