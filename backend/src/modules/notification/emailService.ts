import nodemailer from 'nodemailer';
import { env } from '../../config/env';

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: false,
});

export async function sendMail(to: string, subject: string, text: string): Promise<void> {
  await transporter.sendMail({ from: env.smtp.from, to, subject, text });
}
