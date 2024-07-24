"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const singerSchema = new mongoose_1.Schema({
    fullName: String,
    avatar: String,
    status: String,
    slug: {
        type: String,
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
});
const Singer = (0, mongoose_1.model)("Singer", singerSchema, "singers");
exports.default = Singer;
