"use client";

import { getInitialChats } from "@/hooks/chatHooks";
import { useAppSelector } from "@/store/hooks";
import { ChatMessage, IdProp } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import MessageCard from "../Cards/MessageCard";
import { getSocket } from "@/lib/socket";

export default function MessagePage({ id }: IdProp) {
  const currentUserId = useAppSelector((state) => state.auth.user?._id);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join", currentUserId);

    const handleNewMessage = (incoming: ChatMessage) => {
      const isRelevant =
        (incoming.senderId === currentUserId && incoming.receiverId === id) ||
        (incoming.senderId === id && incoming.receiverId === currentUserId);

      if (isRelevant) {
        const updated = [...messages, incoming].sort(
          (a, b) =>
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );
        setMessages(updated);
      }
    };

    socket.on("messages", handleNewMessage);

    return () => {
      socket.off("messages", handleNewMessage);
    };
  }, [id, currentUserId, messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto space-y-3 scrollbar-hidden-style"
    >
      {messages.map((message) => (
        <MessageCard key={message._id} message={message} />
      ))}
    </div>
  );
}
