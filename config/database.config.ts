import mongoose from 'mongoose'
import * as ENV from './global.config'

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(ENV.MONGO_URL)
    console.log('Connected successfully to MongoDB')
  }
  catch (error) {
    console.log('Fail to connect to MongoDB')
  }
}

export default databaseConnection 