import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/DataBase/dbConnect';
import OTPModel from '@/lib/models/OTP.model';


export async function POST(req: NextRequest) {
    await dbConnect();
    const { email, otp } = await req.json();
    const record = await OTPModel.findOne({ email, otp });

    if (!record || record.expiresAt < Date.now()) {
        return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
    }

    await OTPModel.deleteMany({ email });
    return NextResponse.json({ message: 'Email verified' }, { status: 200 });
}
