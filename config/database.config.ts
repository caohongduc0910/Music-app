import mongoose from 'mongoose'

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Connected successfully to MongoDB')
  }
  catch (error) {
    console.log('Fail to connect to MongoDB')
  }
}

export default databaseConnection 