import { transporter } from "./nodemailer";

interface SendEmailOptions {
  email: string;
  subject: string;
  html: string;
}

export async function sendEmail({ email, subject, html }: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"Todo App" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    });

    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
