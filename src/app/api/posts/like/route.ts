import { dbConnect } from "@/lib/DataBase/dbConnect";
import Like from "@/lib/models/Like.model";
import { verifyAccessToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const postId = body.postId?.trim();

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
        return NextResponse.json({ error: "Invalid PostId" }, { status: 400 });
    }

    const token = req.cookies.get("accessToken")?.value;
    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decodedPayload = verifyAccessToken(token);
    if (!decodedPayload || !decodedPayload.id) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    await dbConnect();
    const currentUserId = decodedPayload.id;

    try {
        const existingLike = await Like.findOne({ PostId: postId, UserId: currentUserId });

        if (existingLike) {
            await Like.deleteOne({ _id: existingLike._id });
            return NextResponse.json({ success: true, message: "Unliked Successfully", like: false }, { status: 200 });
        }

        const newLike = await Like.create({ PostId: postId, UserId: currentUserId });
        return NextResponse.json({ success: true, message: "Liked Successfully", like: true }, { status: 201 });

    } catch (err) {
        console.error("Toggle Like Error:", err);
        return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
    }
}
