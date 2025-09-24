import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/DataBase/dbConnect';
import { sendEmail } from '@/utils/mailer';
import OTPModel from '@/lib/models/OTP.model';
import User from '@/lib/models/User.model';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { email, purpose } = await req.json();

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
        }

        if (purpose === 'signup') {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return NextResponse.json({ message: 'User already exists with this email' }, { status: 409 });
            }
        }

        if (purpose === 'reset') {
            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                return NextResponse.json({ message: 'No account found with this email' }, { status: 404 });
            }
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await OTPModel.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), 
        });
        const emailPurpose = purpose === 'signup' ? 'verify' : 'reset';
        await sendEmail(email, otp, emailPurpose);

        return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Error in sendOTP:', error);
        return NextResponse.json({ message: 'Failed to send OTP' }, { status: 500 });
    }
}
