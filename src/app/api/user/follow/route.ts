import { dbConnect } from "@/lib/dbConnect";
import Follow from "@/lib/models/Follow";
import User from "@/lib/models/User";
import { verifyAccessToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("accessToken")?.value;

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const decodedPayload = verifyAccessToken(token);

        if (!decodedPayload) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }

        await dbConnect();
        const currentUserId = decodedPayload.id;
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const [currUser, targetUser] = await Promise.all([
            User.findById(currentUserId),
            User.findById(userId),
        ]);

        if (!currUser || !targetUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const existingFollow = await Follow.findOne({
            follower: currentUserId,
            following: userId,
        });

        let message: string;

        if (existingFollow) {
            await existingFollow.deleteOne();
            message = "Unfollowed user successfully.";
        } else {
            await Follow.create({
                follower: currentUserId,
                following: userId,
            });
            message = "Followed user successfully.";
        }

        return NextResponse.json({ message }, { status: 200 });
    } catch (err) {
        console.error("Follow/unfollow error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
