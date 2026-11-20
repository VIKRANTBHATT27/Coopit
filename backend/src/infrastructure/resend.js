import { Resend } from "resend";
import 'dotenv/config';

const resend = new Resend(process.env.RESEND_API_KEY);

const createMessage = (emailId, otpCode) => ({
    from: `Coopit <${process.env.RESEND_MAIL_FROM }>`|| "Coopit <onboarding@resend.dev>",
    to: emailId,
    subject: `${otpCode} is your Coopit verification code`,
    text: `Your Coopit verification code is ${otpCode}. It expires in 5 minutes. If you did not request this code, please ignore this email.`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="margin: 0 0 12px; color: #111827; font-size: 20px;">Verify your Coopit account</h2>
        <p style="margin: 0 0 20px; color: #4b5563; font-size: 15px; line-height: 1.5;">
          Enter the following one-time verification code to continue:
        </p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 6px; text-align: center; font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #111827;">
          ${otpCode}
        </div>
        <p style="margin: 20px 0 0; color: #6b7280; font-size: 13px;">
          This code expires in 5 minutes. Never share this code with anyone.
        </p>
      </div>
    `,
});

const sendMail = async (emailId, plainOtp) => {
    try {
        console.log(plainOtp);

        const msg = createMessage(emailId, plainOtp);

        await resend.emails.send(msg);

        return true;
    } catch (err) {
        console.error("failed sending a email\n", err.message);

        return false;
    }
};

export default sendMail;