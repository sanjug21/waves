"use client";
import { io, Socket } from "socket.io-client"; 

let socket: Socket | undefined; 

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "https://socket-kcih.onrender.com", {
            transports: ["websocket", "polling"],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

    }
    return socket;
};
