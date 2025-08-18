import { dbConnect } from "@/lib/dbConnect";
import User from "@/lib/models/User";
import { verifyAccessToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){

    
    try{
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
        const currUser=await User.findById(currentUserId);
        const targetUser=await User.findById(userId);

        if(!currUser || !targetUser){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isFollowing = currUser.following.includes(userId);
        let message:string;

        if (isFollowing) {
            currUser.following.pull(userId);
            targetUser.followers.pull(currentUserId);
            message = "Unfollowed user successfully.";
        } else {
            currUser.following.push(userId);
            targetUser.followers.push(currentUserId);
            message = "Followed user successfully.";
        }

        await currUser.save();
        await targetUser.save();

        return NextResponse.json({ message }, { status: 200 });

    }
    catch(err){

    }
}