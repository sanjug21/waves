import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/DataBase/dbConnect";
import { verifyAccessToken } from "@/utils/auth";
import Message from "@/lib/models/Message.model";
import Conversation from "@/lib/models/Conversation.model";

export async function POST(req: NextRequest) {
    const token = req.cookies.get("accessToken")?.value;
    const body = await req.json();
    const { receiverId } = body;

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
        const conversation = await Conversation.findOne({
            senderId: currentUserId,
            receiverId,
        });

        if (!conversation) {
            return NextResponse.json({ success: true, messages: [] }, { status: 200 });
        }

        const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });

        return NextResponse.json({ success: true, messages }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({
            success: false,
            message: "Error fetching messages",
            error: error.message,
        }, { status: 500 });
    }
}
