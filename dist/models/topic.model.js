"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const topicSchema = new mongoose_1.Schema({
    title: String,
    avatar: String,
    description: String,
    status: String,
    slug: {
        type: String,
        unique: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
}, {
    timestamps: true,
});
const Topic = (0, mongoose_1.model)("Topic", topicSchema, "topics");
exports.default = Topic;
