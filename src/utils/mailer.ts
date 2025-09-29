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
            ? 'Action Required: Verify Your Email Address'
            : 'Secure Your Account: Password Reset Code';

    const text =
        type === 'verify'
            ? `Hello,\n\nWe received a request to verify your email address. Please use the following One-Time Password (OTP) to complete the verification:\n\nOTP: ${otp}\n\nThis code is valid for 10 minutes.\n\nIf you did not initiate this request, please disregard this message.`
            : `Hello,\n\nA password reset request was made for your account. Please use the following One-Time Password (OTP) to proceed:\n\nOTP: ${otp}\n\nThis code is valid for 10 minutes.\n\nIf you did not request a password reset, please ignore this message.`;

    const html =
        type === 'verify'
            ? `
        <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background-color: #f9f9f9;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="
                    font-size: 32px;
                    font-weight: bold;
                    background: linear-gradient(90deg, #00B4DB, #0083B0);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin: 0;
                ">Waves</h1>
            </div>
            <h2 style="color: #333;">Verify Your Email Address</h2>
            <p>Hello,</p>
            <p>We received a request to verify your email address for your Waves account.</p>
            <p>Please use the following One-Time Password (OTP) to complete the verification:</p>
            <p style="font-size: 24px; font-weight: bold; color: #000;">${otp}</p>
            <p>This code is valid for 10 minutes.</p>
            <p>If you did not initiate this request, please disregard this message.</p>
            <p style="margin-top: 30px;">Thank you,<br/>The Waves Team</p>
        </div>
        `
            : `
        <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background-color: #f9f9f9;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="
                    font-size: 32px;
                    font-weight: bold;
                    background: linear-gradient(90deg, #00B4DB, #0083B0);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin: 0;
                ">Waves</h1>
            </div>
            <h2 style="color: #333;">Reset Your Password</h2>
            <p>Hello,</p>
            <p>A password reset request was made for your Waves account.</p>
            <p>Please use the following One-Time Password (OTP) to proceed:</p>
            <p style="font-size: 24px; font-weight: bold; color: #000;">${otp}</p>
            <p>This code is valid for 10 minutes.</p>
            <p>If you did not request a password reset, please ignore this message.</p>
            <p style="margin-top: 30px;">Thank you,<br/>The Waves Team</p>
        </div>
        `;

    await transporter.sendMail({
        from: `"Waves Security" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
    });
}
