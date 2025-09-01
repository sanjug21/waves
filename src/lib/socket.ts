"use client";
import { io, Socket } from "socket.io-client"; 

let socket: Socket | undefined; 

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(process.env.BACKEND_URL || "http://localhost:3001",{
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });
    }
    return socket;
};
