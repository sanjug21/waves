import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, generateTokens } from "@/utils/auth";
import User from "@/lib/models/User";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: "Refresh token not found." }, { status: 401 });
    }

    const decodedPayload = verifyRefreshToken(refreshToken);

    if (!decodedPayload || !decodedPayload.id) {
      const response = NextResponse.json({ message: "Invalid refresh token." }, { status: 401 });
      response.cookies.set('accessToken', '', { httpOnly: true, maxAge: 0 });
      response.cookies.set('refreshToken', '', { httpOnly: true, maxAge: 0 });
      return response;
    }

    const user = await User.findById(decodedPayload.id);

    if (!user) {
      const response = NextResponse.json({ message: "User not found." }, { status: 401 });
      response.cookies.set('accessToken', '', { httpOnly: true, maxAge: 0 });
      response.cookies.set('refreshToken', '', { httpOnly: true, maxAge: 0 });
      return response;
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user);

    const response = NextResponse.json({ message: "Tokens refreshed successfully." }, { status: 200 });
    
    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60,
      path: '/'
    });

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error("Error during token refresh:", error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}
