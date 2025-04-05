import nodemailer from 'nodemailer'
import { EMAIL_SERVER, EMAIL_PASSWORD } from '../config'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_SERVER,
    pass: EMAIL_PASSWORD
  }
})

export async function sendEmail (to: string, subject: string, html: string): Promise<nodemailer.SentMessageInfo> {
  const mailOptions = {
    from: `"Foro Personal" <${EMAIL_SERVER}>`,
    to,
    subject,
    html
  }

  return await transporter.sendMail(mailOptions)
}
