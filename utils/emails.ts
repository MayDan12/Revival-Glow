// lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
  return resend.emails.send({
    from: "Your App <no-reply@yourdomain.com>",
    to,
    subject,
    html,
  });
}
