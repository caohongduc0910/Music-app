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
exports.uploadFields = exports.uploadSingle = void 0;
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
require("../config/cloudinary.config");
const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary_1.v2.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (result) {
                resolve(result.url);
            }
            else {
                reject(error);
            }
        });
        streamifier_1.default.createReadStream(buffer).pipe(stream);
    });
};
const uploadToCloudinary = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield streamUpload(buffer);
    return result;
});
const uploadSingle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield uploadToCloudinary(req.file.buffer);
        req.body[req.file.fieldname] = result;
    }
    catch (error) {
        console.log(error);
    }
    next();
});
exports.uploadSingle = uploadSingle;
const uploadFields = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const key in req.files) {
            req.body[key] = null;
            const array = req.files[key];
            console.log(array);
            if (array.length > 0) {
                const result = yield uploadToCloudinary(array[0].buffer);
                req.body[key] = result;
            }
        }
    }
    catch (error) {
        console.log(error);
    }
    next();
});
exports.uploadFields = uploadFields;
