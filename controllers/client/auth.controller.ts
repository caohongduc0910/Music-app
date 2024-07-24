import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createAccessToken, decodeAccessToken } from "../../helpers/jwtToken";
import confirmEmail from "../../helpers/sendMail";

import User from "../../models/user.model";
import Token from "../../models/token.model";

export const registerGet = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.render("client/pages/auth/register.pug");
};

export const registerPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const existUser = await User.findOne({
    email: req.body.email,
    status: "active",
    deleted: false,
  });

  if (existUser) {
    req.flash("fail", "Email đã tồn tại");
    res.redirect("back");
  } else {
    if (req.body.password != req.body.cfpassword) {
      req.flash("fail", "Mật khẩu xác nhận không khớp");
      res.redirect("back");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPasword: string = await bcrypt.hash(req.body.password, salt);

      interface User {
        name: string;
        dob: string;
        email: string;
        password: string;
      }

      const user: User = {
        name: req.body.name,
        dob: req.body.dob,
        email: req.body.email,
        password: hashedPasword,
      };

      let newUser = new User(user);
      newUser = await newUser.save();

      const token: string = createAccessToken(newUser.id);
      const subject: string = "Email xác nhận kích hoạt tài khoản";

      let link: string = `http://localhost:3000/auth/confirm?token=${token}`;

      const html: string = `
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
      confirmEmail(newUser.email, subject, html);

      req.flash(
        "success",
        "Đăng kí thành công, vui lòng vào email để kích hoạt tài khoản"
      );
      res.redirect("/auth/login");
    }
  }
};

export const confirmGet = async (
  req: Request,
  res: Response
): Promise<void> => {
  const decoded: any = decodeAccessToken(req.query.token);
  await User.updateOne(
    {
      _id: decoded.id,
    },
    {
      status: "active",
    }
  );

  res.redirect("/auth/login");
};

export const loginGet = async (req: Request, res: Response): Promise<void> => {
  res.render("client/pages/auth/login.pug");
};

export const loginPost = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (!user) {
    req.flash("fail", "Email không tồn tại");
    res.redirect("back");
  } else {
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      req.flash("fail", "Sai mật khẩu");
      res.redirect("back");
    } else {
      if (user.status == "inactive") {
        req.flash("fail", "Tài khoản bị khóa");
        res.redirect("back");
      } else {
        const accessToken = createAccessToken(user.id);
        const newToken = new Token({
          userID: user.id,
          token: accessToken,
        });

        await newToken.save();
        res.cookie("token", accessToken);

        req.flash("success", "Đăng nhập thành công");
        res.redirect("/topics");
      }
    }
  }

  // if (await getTokenByID(newToken.id)) {
  //   const task = cron.schedule("0 */12 * * *", async () => {
  //     await deleleTokenByID(newToken.id);
  //     console.log("Token deleted");
  //     task.stop();
  //   });
  // }
};

export const logoutGet = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("token");
  res.redirect("/auth/login");
};
