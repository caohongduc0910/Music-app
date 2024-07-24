import express, { Express } from "express";
import path from "path";
import databaseConnection from "./config/database.config";
import dotenv from "dotenv";
import moment from "moment";
import methodOverride from "method-override";
import flash from "express-flash";
import cookieParser from "cookie-parser";
import session from "express-session";

const app: Express = express();
dotenv.config();

app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//Flash
app.use(cookieParser("keyboard cat"));
app.use(
  session({
    secret: process.env.SESSION_KEY,
    cookie: { maxAge: 60000 },
  })
);
app.use(flash());

databaseConnection();

import prefixAdmin from "./config/prefix.config";
app.locals.moment = moment;
app.locals.prefixAdmin = prefixAdmin;

//TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

import adminRouter from "./routes/admin/index.route";
import clientRouter from "./routes/client/index.route";
app.use(adminRouter);
app.use(clientRouter);

const port: string | number = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
