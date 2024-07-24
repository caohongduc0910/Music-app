"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_model_1 = __importDefault(require("../models/token.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const ENV = __importStar(require("../config/global.config"));
const authToken = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jsonwebtoken_1.default.verify(token, ENV.JWT_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                req.flash("fail", "Token không chính xác");
                res.redirect("/auth/login");
            }
            const existToken = yield token_model_1.default.findOne({
                token: token,
            });
            if (existToken) {
                const existUser = yield user_model_1.default.findOne({
                    _id: existToken.userID,
                });
                res.locals.user = existUser;
                next();
            }
            else {
                req.flash("fail", "Thời gian đăng nhập đã hết, vui lòng đăng nhập lại");
                res.redirect("/auth/login");
            }
        }));
    }
    else {
        next();
    }
};
exports.default = authToken;
