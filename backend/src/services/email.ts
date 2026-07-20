import nodemailer from 'nodemailer'
import { config } from '../config'

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (transporter) return transporter
  if (config.smtp.host) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: { user: config.smtp.user, pass: config.smtp.pass },
    })
  }
  return transporter
}

export async function sendOTP(email: string, otp: string) {
  const t = getTransporter()
  if (t) {
    await t.sendMail({
      from: config.smtp.from,
      to: email,
      subject: 'TaskFlow - Email Verification',
      html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#9d4edd">TaskFlow Email Verification</h2>
        <p>Your OTP is:</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;padding:16px;background:#f3e8ff;border-radius:12px;color:#9d4edd">${otp}</div>
        <p style="color:#666">This code expires in 10 minutes.</p>
        <p style="color:#999;font-size:12px">If you didn't request this, ignore this email.</p>
      </div>`,
    })
  }
  console.log(`[TaskFlow Email] OTP for ${email}: ${otp}`)
}
