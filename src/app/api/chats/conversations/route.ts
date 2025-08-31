import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/DataBase/dbConnect";
import { verifyAccessToken } from "@/utils/auth";
import { Conversation } from "@/lib/models/Conversation";

export async function GET(req: NextRequest) {
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
        const conversations = await Conversation.find({ senderId: currentUserId })
            .populate("receiverId", "_id name dp  online")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });

        return NextResponse.json({ success: true, conversations }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching conversations:", error);
        return NextResponse.json({
            success: false,
            message: "Error fetching conversations",
            error: error.message,
        }, { status: 500 });
    }
}
