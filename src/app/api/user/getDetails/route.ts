import { dbConnect } from "@/lib/DataBase/dbConnect";
import User from "@/lib/models/User.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const userId = body.userId?.trim();

    if (!userId) {
        return new Response("User ID is required", { status: 400 });
    }

    try {
        await dbConnect();

        const user = await User.findById(userId).select("-password -__v -createdAt -updatedAt");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching user details:", error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        }, { status: 500 });
    }
}
