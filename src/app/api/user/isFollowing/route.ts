import { dbConnect } from "@/lib/DataBase/dbConnect";
import Follow from "@/lib/models/Follow.model";
import { verifyAccessToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const targetUserId = body.targetUserId?.trim();

    if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
        return NextResponse.json({ error: "Invalid or missing targetUserId" }, { status: 400 });
    }

    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = verifyAccessToken(token);

    if (!decoded?.id) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    try {
        await dbConnect();

        const currentUserId = decoded.id;

        const followDoc = await Follow.findOne({
            follower: currentUserId,
            following: targetUserId,
        });

        return NextResponse.json({ isFollowing: !!followDoc }, { status: 200 });
    } catch (error: any) {
        console.error("Error checking follow status:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error",
            error: error.message
        }, { status: 500 });
    }
}
