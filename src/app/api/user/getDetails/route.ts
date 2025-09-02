import { dbConnect } from "@/lib/DataBase/dbConnect";
import User from "@/lib/models/User.model";
import { verifyAccessToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
     const { searchParams } = req.nextUrl;
    const userId = searchParams.get("id");

    if (!userId) {
            return new Response("User ID is required", { status: 400 });
    }

    try {
        await dbConnect();

         const user = await User.findById(userId).select('-password -__v -createdAt -updatedAt '); 
            
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user details:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}