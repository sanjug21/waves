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

        const followers = await Follow.find({ following: userId })
            .populate({
                path: "follower",
                select: "_id dp name email bio online",
            });

        const formattedFollowers = followers.map(f => f.follower);

        return NextResponse.json({ followers: formattedFollowers }, { status: 200 });
    } catch (error) {
        console.error("Error fetching followers:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
