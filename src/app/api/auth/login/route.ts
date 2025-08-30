
import { dbConnect } from "@/lib/dbConnect";
import User from "@/lib/models/User";
import { NextRequest, NextResponse } from "next/server";
import { generateTokens } from "@/utils/auth";
import { LoginSchema } from "@/lib/schema/user.schema";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const data = LoginSchema.parse(body);
    const { email, password } = data;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
    
    const isPasswordValid = await user.matchPassword(password);
    
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const { accessToken, refreshToken } = generateTokens(user);
    
    const response = NextResponse.json(
      {
        message: "Login successful",
        userDetails: {
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
        }
      },
      { status: 200 }
    );
    
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60,
      path: '/'
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    return response;
    
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}