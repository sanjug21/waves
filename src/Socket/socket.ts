import 'dotenv/config';
import  {createServer} from 'http';
import {Server, Socket} from 'socket.io';
import Conversation from '../lib/models/Conversation';
import { dbConnect } from '../lib/DataBase/dbConnect';
import { sendMessage } from './Message/sendMessage';

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
(async () => {
    try {
        await dbConnect();

        io.on("connection", (socket: Socket) => {

            socket.on("getConversation", async (uid: string) => {
                try {
                    
                    const conversations = await Conversation.find({
                        $or: [{ senderId: uid }, { receiverId: uid }]
                    })
                        .populate("lastMessage", "content type isSeen")
                        .populate("receiverId", "_id name dp email")
                        .sort({ updatedAt: -1 });

                    socket.emit("conversation", conversations);
                } catch (error) {
                    console.error("[Socket] Error fetching conversation:", error);
                    socket.emit("conversation_error", "Failed to load conversations");
                }
            });

            socket.on("sendMessage", (payload: any) => sendMessage(io, socket, payload));

            socket.on("disconnect", () => {
                console.log(`[Socket] User disconnected: ${socket.id}`);
            });
        });

        const PORT = process.env.SOCKET_PORT || 3001;
        httpServer.listen(PORT, () => {
            console.log(`[Socket] Socket.IO server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("[Socket] Failed to connect to the database:", error);
        process.exit(1); // Exit if the database connection fails on start
    }
})();