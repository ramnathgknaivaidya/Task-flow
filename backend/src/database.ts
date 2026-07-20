import mongoose from 'mongoose'
import { config } from './config'

export async function connectDB() {
  const uri = config.mongodb.uri
  if (!uri) {
    console.warn('[TaskFlow DB] MONGODB_URI not set — using in-memory mock data')
    return
  }
  try {
    await mongoose.connect(uri)
    console.log(`[TaskFlow DB] Connected to MongoDB`)
  } catch (err) {
    console.error('[TaskFlow DB] Connection failed:', err)
    process.exit(1)
  }
}
