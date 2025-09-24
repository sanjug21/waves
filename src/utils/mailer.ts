import nodemailer from 'nodemailer';

type EmailType = 'verify' | 'reset';

export async function sendEmail(to: string, otp: string, type: EmailType) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: true, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const subject =
        type === 'verify'
            ? 'Verify Your Email Address - OTP Inside'
            : 'Reset Your Password - OTP Code';

    const text =
        type === 'verify'
            ? `Welcome! Use the following OTP to verify your email: ${otp}\nThis code expires in 10 minutes.`
            : `You requested a password reset. Use this OTP to proceed: ${otp}\nThis code expires in 10 minutes.`;

    await transporter.sendMail({
        from: `"SecureAuth" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    });
}
