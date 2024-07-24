"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const database_config_1 = __importDefault(require("./config/database.config"));
const dotenv_1 = __importDefault(require("dotenv"));
const moment_1 = __importDefault(require("moment"));
const method_override_1 = __importDefault(require("method-override"));
const express_flash_1 = __importDefault(require("express-flash"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.static(`${__dirname}/public`));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, method_override_1.default)("_method"));
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use((0, cookie_parser_1.default)("keyboard cat"));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_KEY,
    cookie: { maxAge: 60000 },
}));
app.use((0, express_flash_1.default)());
(0, database_config_1.default)();
const prefix_config_1 = __importDefault(require("./config/prefix.config"));
app.locals.moment = moment_1.default;
app.locals.prefixAdmin = prefix_config_1.default;
app.use("/tinymce", express_1.default.static(path_1.default.join(__dirname, "node_modules", "tinymce")));
const index_route_1 = __importDefault(require("./routes/admin/index.route"));
const index_route_2 = __importDefault(require("./routes/client/index.route"));
app.use(index_route_1.default);
app.use(index_route_2.default);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
