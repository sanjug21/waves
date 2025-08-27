import { dbConnect } from "@/lib/dbConnect";
import Follow from "@/lib/models/Follow";
import User from "@/lib/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("id");

    if (!userId) {
        return new Response("User ID is required", { status: 400 });
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
    } catch (error) {
        console.error("Error fetching followings:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
