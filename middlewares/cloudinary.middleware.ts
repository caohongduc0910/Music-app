import { Request, Response, NextFunction } from "express"
import { v2 as cloudinary } from "cloudinary"
import streamifier from "streamifier"

import '../config/cloudinary.config'

const streamUpload = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
      if (result) {
        resolve(result.url)
      } else {
        reject(error)
      }
    })

    streamifier.createReadStream(buffer).pipe(stream)
  })
}

const uploadToCloudinary = async (buffer: Buffer): Promise<string> => {
  let result = await streamUpload(buffer)
  return result
}

export const uploadSingle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await uploadToCloudinary(req.file.buffer)
    req.body[req.file.fieldname] = result
  } catch (error) {
    console.log(error) 
  }
  next()
}

export const uploadFields = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    for (const key in req.files) {
      req.body[key] = []
      const array = req.files[key]

      for (const item of array) {
        try {
          const result = await uploadToCloudinary(item.buffer)
          req.body[key].push(result)
        } catch (error) {
          console.log(error)
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
  // next()
}