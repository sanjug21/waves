import { dbConnect } from "@/lib/DataBase/dbConnect";
import Follow from "@/lib/models/Follow.model";
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

        const followers = await Follow.find({ following: userId })
            .populate({
                path: "follower",
                select: "_id dp name email bio online",
            });

        const formattedFollowers = followers.map(f => f.follower);

        return NextResponse.json({ followers: formattedFollowers }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching followers:", error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        }, { status: 500 });
    }
}
