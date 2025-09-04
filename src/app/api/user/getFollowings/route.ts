import { dbConnect } from "@/lib/DataBase/dbConnect";
import Follow from "@/lib/models/Follow.model";
import User from "@/lib/models/User.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const userId = body.userId?.trim();

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ error: "Invalid or missing userId" }, { status: 400 });
    }

    try {
        await dbConnect();

        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const followings = await Follow.find({ follower: userId })
            .populate({
                path: "following",
                select: "_id dp name email bio online",
            });

        const formattedFollowings = followings.map(f => f.following);

        return NextResponse.json({ followings: formattedFollowings }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching followings:", error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        }, { status: 500 });
    }
}
