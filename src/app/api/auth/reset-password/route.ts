import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/DataBase/dbConnect';
import UserModel from '@/lib/models/User.model';
import { ResetPasswordSchema } from '@/lib/schema/user.schema';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        const parsed = ResetPasswordSchema.safeParse({
            password,
            confirmPassword: password,
        });

        if (!parsed.success) {
            const firstIssue = parsed.error.issues[0];
            return NextResponse.json({ message: firstIssue.message }, { status: 400 });
        }

        const user = await UserModel.findOne({ email }).select('+password');
        if (!user) {
            return NextResponse.json({ message: 'No account found with this email' }, { status: 404 });
        }

        user.password = password;
        user.markModified('password');
        await user.save();

        return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Error in reset-password:', error);
        return NextResponse.json({ message: 'Failed to reset password' }, { status: 500 });
    }
}
