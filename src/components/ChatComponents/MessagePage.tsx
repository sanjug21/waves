"use client";

import { getInitialChats } from "@/hooks/chatHooks";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useRef, useState } from "react";
import MessageCard from "../Cards/MessageCard";
import { getSocket } from "@/lib/socket";
import { IdProp } from "@/types/Props.types";
import { ChatMessage } from "@/types/Conversation.type";

export default function MessagePage({ id }: IdProp) {
  const currentUserId = useAppSelector((state) => state.auth.user?._id);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial Fetch
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getInitialChats(id);
        const sorted = [...response].sort(
          (a, b) =>
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );
        setMessages(sorted);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [id]);

  // Socket Logic
  useEffect(() => {
    const socket = getSocket();
    socket.emit("join", currentUserId);

    const handleNewMessage = (incoming: ChatMessage) => {
      const isRelevant =
        (incoming.senderId === currentUserId && incoming.receiverId === id) ||
        (incoming.senderId === id && incoming.receiverId === currentUserId);

      if (isRelevant) {
        // Use functional state update to ensure we have the latest messages array
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === incoming._id);
          if (exists) return prev;

          return [...prev, incoming].sort(
            (a, b) =>
              new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          );
        });
      }
    };

    socket.on("messages", handleNewMessage);
    return () => {
      socket.off("messages", handleNewMessage);
    };
  }, [id, currentUserId]); // Removed 'messages' from dependency to prevent recursive listeners

  // Smooth Scroll to Bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden">
      {/* Top Fade Gradient: 
          Makes messages look like they are disappearing into the header elegantly 
      */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#000828]/40 to-transparent z-10 pointer-events-none md:from-transparent" />

      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto px-4 py-6 space-y-2 scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-white mb-4 animate-spin-slow" />
            <p className="text-xs uppercase tracking-[0.3em] font-black">
              Begin Wave
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message._id || index}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <MessageCard message={message} />
            </div>
          ))
        )}
      </div>

      {/* Bottom Fade Gradient: Smoothens transition to the Input Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#000828]/40 to-transparent z-10 pointer-events-none" />
    </div>
  );
}
