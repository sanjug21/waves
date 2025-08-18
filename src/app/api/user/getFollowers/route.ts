import { dbConnect } from "@/lib/dbConnect";
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

        const user = await User.findById(userId)
            .select('followers following')
            .populate({
                path: 'followers',
                select: '_id dp name email'
            })
            .populate({
                path: 'following',
                select: '_id dp name email'
            });
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user details:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}