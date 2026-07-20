import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' },
  emailVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiresAt: { type: Date },
}, { timestamps: true })

export const User = mongoose.model('User', userSchema)
