import { dbConnect } from "@/lib/DataBase/dbConnect";
import Like from "@/lib/models/Like.model";
import { verifyAccessToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest) {
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
    try{

        const existingLike= await Like.findOne({ PostId: searchQuery, UserId: currentUserId });
        if(existingLike ) {
            await Like.deleteOne({ _id: existingLike._id });
            return NextResponse.json({ error: "Unliked Successfully" }, { status: 200 });
        }
        const newLike=await Like.create({ PostId: searchQuery, UserId: currentUserId });
        return NextResponse.json({ success: true, message: "Liked Successfully", like: newLike }, { status: 201 });

    }
        catch(err){
        return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
        }
    
}