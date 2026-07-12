import nodemailer from 'nodemailer';
import { env } from '../../config/env';

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465,
  auth: env.smtp.user && env.smtp.pass ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
});

export async function sendMail(to: string, subject: string, text: string): Promise<void> {
  await transporter.sendMail({ from: env.smtp.from, to, subject, text });
}
