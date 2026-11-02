import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const from = process.env.EMAIL_FROM || "Mirr <hello@mirr.app>";

  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_placeholder") {
    console.log(`[Email Mock Sent] To: ${to} | Subject: "${subject}"`);
    return { success: true, mocked: true };
  }

  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Resend send email error:", error);
    return { success: false, error };
  }
}

