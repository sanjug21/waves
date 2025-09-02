"use client";

import ChatTextField from "@/components/ChatComponents/chatTextField";
import MessagePage from "@/components/ChatComponents/MessagePage";
import { getUser } from "@/hooks/profileHooks";
import { UserDetails } from "@/types/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Chat() {
  const params = useParams();
  const id = params?.id as string;
  const defImg = "/def.png";

  const [chatUser, setChatUser] = useState<UserDetails | null>(null);

  useEffect(() => {
    const fetchChatUser = async () => {
      try {
        const user = await getUser(id);
        setChatUser(user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchChatUser();
  }, [id]);

  return (
    <div className="ChatBg h-[calc(100vh-75px)] flex flex-col text-white">
      {/* Header */}
      <div className="flex items-center space-x-4 bg-gradient-to-r from-[rgb(0,12,60)] to-[rgb(0,20,80)] p-2 shadow-lg backdrop-blur-md border-b border-blue-400">
        <img
          src={chatUser?.dp || defImg}
          alt={`${chatUser?.name || "User"}'s profile picture`}
          className="h-12 w-12 rounded-full object-cover shadow-sm"
        />
        <span className="text-lg font-semibold">{chatUser?.name}</span>
      </div>

      {/* Message Page */}
      <div className="h-[calc(100%-131px)] flex-grow overflow-hidden p-1">
        <MessagePage id={id} />
      </div>

      {/* Chat Input */}
        <ChatTextField id={id} />
      
    </div>
  );
}
