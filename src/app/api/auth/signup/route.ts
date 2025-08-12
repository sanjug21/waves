import { dbConnect } from "@/lib/dbConnect";
import User from "@/lib/models/User";
import { SignupSchema } from "@/lib/schema/user.schema";
import { generateTokens } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const data = SignupSchema.parse(body);
    const { name, email, password } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();
    
    const { accessToken, refreshToken } = generateTokens(newUser);

    const response = NextResponse.json(
      { 
        message: "User registered successfully", 
        userDetails: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          dp: newUser.dp,
          bio: newUser.bio,
          online: newUser.online,
        }
      },
      { status: 201 }
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
    console.error("Error during signup:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}