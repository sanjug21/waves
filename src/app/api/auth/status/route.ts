import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/utils/auth';
import { dbConnect } from '@/lib/DataBase/dbConnect';
import User from '@/lib/models/User';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const accessToken = req.cookies.get('accessToken');

    if (!accessToken) {
      return NextResponse.json({ isAuthenticated: false, userDetails: null }, { status: 200 });
    }

    const decodedToken = verifyAccessToken(accessToken.value);

    if (!decodedToken || !decodedToken.id) {
      return NextResponse.json({ isAuthenticated: false, userDetails: null }, { status: 200 });
    }

    const user = await User.findById(decodedToken.id).select('-password');

    if (!user) {
      return NextResponse.json({ isAuthenticated: false, userDetails: null }, { status: 200 });
    }

    const userDetails = {
      _id: user._id,
      name: user.name,
      nickname: user.nickname,
      email: user.email,
      dp: user.dp,
      bio: user.bio,
      phone: user.phone,
      dob: user.dob,
      address: user.address,
      gender: user.gender,
      online: user.online,
    };

    return NextResponse.json({ isAuthenticated: true, userDetails }, { status: 200 });

  } catch (error) {
    console.error("Error checking auth status:", error);
    return NextResponse.json(
      { message: "Failed to check authentication status" },
      { status: 500 }
    );
  }
}
