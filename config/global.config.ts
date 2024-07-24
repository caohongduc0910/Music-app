import dotenv from "dotenv"
dotenv.config()

const MONGO_URL = process.env.MONGO_URL

const SESSION_KEY = process.env.SESSION_KEY

const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRY = process.env.JWT_EXPIRY

const CLOUD_NAME = process.env.CLOUD_NAME
const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET

export {
  MONGO_URL,
  SESSION_KEY,
  EMAIL_USER,
  EMAIL_PASS,
  JWT_SECRET,
  JWT_EXPIRY,
  CLOUD_NAME,
  API_KEY,
  API_SECRET
}