import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/User.model";
import Follow from "@/lib/models/Follow.model";
import { dbConnect } from "@/lib/DataBase/dbConnect";
import { Types } from "mongoose";
import { verifyAccessToken } from "@/utils/auth"; 

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const searchQuery = searchParams.get("query")?.trim();

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
        const regex = searchQuery ? new RegExp(searchQuery, "i") : null;

        const following = await Follow.find({ follower: currentUserId }).select("following");
        const followers = await Follow.find({ following: currentUserId }).select("follower");

        const followingIds = following.map((f) => f.following.toString());
        const followerIds = followers.map((f) => f.follower.toString());

        const combinedIds = Array.from(new Set([...followingIds, ...followerIds]));

        const query: any = {
            _id: { $in: combinedIds.map((id) => new Types.ObjectId(id)) },
        };

        if (regex) {
            query.$or = [{ name: regex }, { email: regex }];
        }

        const users = await User.find(query).select("_id name dp email bio online");

        return NextResponse.json({ success: true, users }, { status: 200 });
    } catch (error: any) {
        console.error("Error searching users:", error);
        return NextResponse.json({
            success: false,
            message: "Error searching users",
            error: error.message,
        }, { status: 500 });
    }
}
