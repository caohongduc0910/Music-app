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
exports.logoutGet = exports.loginPost = exports.loginGet = exports.confirmGet = exports.registerPost = exports.registerGet = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtToken_1 = require("../../helpers/jwtToken");
const sendMail_1 = __importDefault(require("../../helpers/sendMail"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const token_model_1 = __importDefault(require("../../models/token.model"));
const registerGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/auth/register.pug");
});
exports.registerGet = registerGet;
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield user_model_1.default.findOne({
        email: req.body.email,
        status: "active",
        deleted: false,
    });
    if (existUser) {
        req.flash("fail", "Email đã tồn tại");
        res.redirect("back");
    }
    else {
        if (req.body.password != req.body.cfpassword) {
            req.flash("fail", "Mật khẩu xác nhận không khớp");
            res.redirect("back");
        }
        else {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPasword = yield bcrypt_1.default.hash(req.body.password, salt);
            const user = {
                name: req.body.name,
                dob: req.body.dob,
                email: req.body.email,
                password: hashedPasword,
            };
            let newUser = new user_model_1.default(user);
            newUser = yield newUser.save();
            const token = (0, jwtToken_1.createAccessToken)(newUser.id);
            const subject = "Email xác nhận kích hoạt tài khoản";
            let link = `http://localhost:3000/auth/confirm?token=${token}`;
            const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  color: #333;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  padding: 20px;
              }
              .header {
                  text-align: center;
                  padding: 20px 0;
              }
              .header img {
                  max-width: 100px;
              }
              .content {
                  text-align: center;
              }
              .content h3 {
                  color: #007bff;
              }
              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  font-size: 16px;
                  color: #ffffff;
                  background-color: #8dc1fa;
                  border-radius: 5px;
                  text-decoration: none;
              }
              .footer {
                  text-align: center;
                  margin-top: 20px;
                  padding-top: 20px;
                  border-top: 1px solid #eeeeee;
              }
              .footer p {
                  color: #aaaaaa;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq7ZjEoJcfvO7Cpkt2zN0tlddPSEWB5aECtQ&s" alt="Company Logo">
              </div>
              <div class="content">
                  <h3>Xin chào bạn ${newUser.email},</h3>
                  <p>Vui lòng nhấn vào nút bên dưới để kích hoạt tài khoản của bạn:</p>
                  <a href="${link}" class="button">Xác nhận tài khoản!</a>
              </div>
              <div class="footer">
                  <p>Chúng tôi rất vui mừng được chào đón bạn!</p>
                  <p>Trân trọng,<br>Đội ngũ hỗ trợ của chúng tôi</p>
              </div>
          </div>
      </body>
      </html>
    `;
            (0, sendMail_1.default)(newUser.email, subject, html);
            req.flash("success", "Đăng kí thành công, vui lòng vào email để kích hoạt tài khoản");
            res.redirect("/auth/login");
        }
    }
});
exports.registerPost = registerPost;
const confirmGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, jwtToken_1.decodeAccessToken)(req.query.token);
    yield user_model_1.default.updateOne({
        _id: decoded.id,
    }, {
        status: "active",
    });
    res.redirect("/auth/login");
});
exports.confirmGet = confirmGet;
const loginGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/auth/login.pug");
});
exports.loginGet = loginGet;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({
        email: req.body.email,
        deleted: false,
    });
    if (!user) {
        req.flash("fail", "Email không tồn tại");
        res.redirect("back");
    }
    else {
        const validPassword = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!validPassword) {
            req.flash("fail", "Sai mật khẩu");
            res.redirect("back");
        }
        else {
            if (user.status == "inactive") {
                req.flash("fail", "Tài khoản bị khóa");
                res.redirect("back");
            }
            else {
                const accessToken = (0, jwtToken_1.createAccessToken)(user.id);
                const newToken = new token_model_1.default({
                    userID: user.id,
                    token: accessToken,
                });
                yield newToken.save();
                res.cookie("token", accessToken);
                req.flash("success", "Đăng nhập thành công");
                res.redirect("/topics");
            }
        }
    }
});
exports.loginPost = loginPost;
const logoutGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token");
    res.redirect("/auth/login");
});
exports.logoutGet = logoutGet;
