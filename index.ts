import express, { Express } from "express" 
import path from "path"
import databaseConnection from './config/database.config'
import dotenv from "dotenv"
import moment from "moment"
import methodOverride from "method-override"

const app: Express = express()

app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(methodOverride("_method"))

app.set("views", "./views")
app.set("view engine", "pug")

dotenv.config()
databaseConnection()

import prefixAdmin from "./config/prefix.config"
app.locals.moment = moment
app.locals.prefixAdmin = prefixAdmin

//TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')))

import adminRouter from "./routes/admin/index.route"
import clientRouter from "./routes/client/index.route"
app.use(adminRouter)
app.use(clientRouter)

const port: string | number = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})