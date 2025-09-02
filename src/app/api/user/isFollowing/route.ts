import { dbConnect } from "@/lib/DataBase/dbConnect";
import Follow from "@/lib/models/Follow.model";
import { verifyAccessToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const targetUserId = searchParams.get("id");

    if (!targetUserId) {
        return NextResponse.json({ error: "Target user ID is required" }, { status: 400 });
    }

    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
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
    } catch (error) {
        console.error("Error checking follow status:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
