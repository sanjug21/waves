import Conversation from "@/lib/models/Conversation";
import { Server, Socket } from "socket.io";

export const Conversations = async(io:Server,socket:Socket,id:string) => {
    try{
        
        const conversations = await Conversation.find({
            senderId: id
        })
            .populate("receiverId", "name dp email")
            .sort({ updatedAt: -1 });


        socket.emit("conversation", conversations);
    } catch (error) {
        console.error("[Socket] Error fetching conversation:", error);
        socket.emit("conversation_error", "Failed to load conversations");
    }
}
