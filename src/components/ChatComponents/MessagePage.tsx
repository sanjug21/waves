import { getInitalChats } from "@/hooks/chatHooks";
import { useAppSelector } from "@/store/hooks";
import { ChatMessage, IdProp } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import MessageCard from "../Cards/MessageCard";

export default function MessagePage({ id }: IdProp) {
  const currentUserId = useAppSelector((state) => state.auth.user?._id);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getInitalChats(id);
        setMessages(response);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [id]);

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
