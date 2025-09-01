import { dbConnect } from "@/lib/DataBase/dbConnect";
import Conversation from "@/lib/models/Conversation";
import Message from "@/lib/models/Message";
import { SendMessagePayload } from "@/types/types";
import { Server, Socket } from "socket.io";

export const sendMessage = async (io: Server, socket: Socket, data: SendMessagePayload) => {
    try {
        const lastMessagePreview = data.message?.trim()
            ? data.message.trim()
            : data.image
                ? "sent a photo 📷"
                : data.video
                    ? "sent a video 📹"
                    : data.audio
                        ? "sent an audio 🎵"
                        : data.file
                            ? "sent a file 📄"
                            : "";
        
        let senderConversation = await Conversation.findOne({
            senderId: data.senderId,
            receiverId: data.receiverId,
        });
        if (!senderConversation) {
            senderConversation = await Conversation.create({
                senderId: data.senderId,
                receiverId: data.receiverId,
                lastMessage: lastMessagePreview,
                lastMessageSeen: true,
            });
        } else {
            senderConversation.lastMessage = lastMessagePreview;
            await senderConversation.save();
        }

        let receiverConversation = await Conversation.findOne({
            senderId: data.receiverId,
            receiverId: data.senderId,
        });

        if (!receiverConversation) {
            receiverConversation = await Conversation.create({
                senderId: data.receiverId,
                receiverId: data.senderId,
                lastMessage: lastMessagePreview,
            });
        } else {
            receiverConversation.lastMessage = lastMessagePreview;
            await receiverConversation.save();
        }
        

        const senderMessage = await Message.create({
            conversationId: senderConversation._id,
            isSeen: true,
            ...data,
        });

        const receiverMessage = await Message.create({
            conversationId: receiverConversation._id,
            ...data,
        });
        
        socket.emit("message_success", { status: "ok" });

        // io.to(data.receiverId).emit("new_message", receiverMessage);
        // io.to(data.senderId).emit("conversation", senderConversation);
        // io.to(data.receiverId).emit("conversation", receiverConversation);
        const emitConversations = async (userId: string) => {
            const updated = await Conversation.find({
                senderId: userId 
            })
                .populate("receiverId", "name dp email")
                .sort({ updatedAt: -1 });

            io.to(userId).emit("conversation", updated);
        };

        await emitConversations(data.senderId);
        await emitConversations(data.receiverId);
    } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("message_error", "Failed to send message");
    }
};
