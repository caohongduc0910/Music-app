import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import Token from "../models/token.model";
import User from "../models/user.model";
import * as ENV from "../config/global.config";

const authToken = (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.cookies.token;

  if (token) {
    jwt.verify(token, ENV.JWT_SECRET, async (err, user) => {
      if (err) {
        req.flash("fail", "Token không chính xác");
        res.redirect("/auth/login");
      }
      const existToken = await Token.findOne({
        token: token,
      });

      if (existToken) {
        const existUser = await User.findOne({
          _id: existToken.userID,
        });

        res.locals.user = existUser;
        next();
      } else {
        req.flash("fail", "Thời gian đăng nhập đã hết, vui lòng đăng nhập lại");
        res.redirect("/auth/login");
      }
    });
  } else {
    // req.flash("fail", "Vui lòng đăng nhập");
    // res.redirect("/auth/login");
    next();
  }
};

export default authToken;
