"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: String,
    password: String,
    name: String,
    dob: String,
    status: {
        type: String,
        default: "inactive"
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
});
const User = (0, mongoose_1.model)("User", userSchema, "users");
exports.default = User;
