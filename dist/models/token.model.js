"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tokenSchema = new mongoose_1.Schema({
    userID: String,
    token: String,
    "expireAt": {
        type: Date,
        expires: 12 * 3600
    }
}, {
    timestamps: true,
});
const Token = (0, mongoose_1.model)("Token", tokenSchema, "tokens");
exports.default = Token;
