import mongoose from 'mongoose'
import { MONGO_URI } from '../config'

export const connectToMongo = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGO_URI, { authSource: 'admin' })
  }
}
