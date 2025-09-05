import 'dotenv/config';
import  {createServer} from 'http';
import {Server, Socket} from 'socket.io';
import { dbConnect } from '../lib/DataBase/dbConnect';
import { sendMessage } from './Message/sendMessage';
import { SendMessagePayload } from '@/types/types';

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
(async () => {
    try {
        await dbConnect();

        io.on("connection", (socket: Socket) => {
            
            socket.on("join", (userId: string) => {
                socket.join(userId);
            });
            socket.on("sendMessage", async(payload: SendMessagePayload) => await sendMessage(io, socket, payload));
           
            socket.on("disconnect", () => {
                console.log(`[Socket] User disconnected`);
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