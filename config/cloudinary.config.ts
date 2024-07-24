import { v2 as cloudinary } from 'cloudinary' 
import * as ENV from "./global.config"

cloudinary.config({
  cloud_name: ENV.CLOUD_NAME,
  api_key: ENV.API_KEY,
  api_secret: ENV.API_SECRET,
})