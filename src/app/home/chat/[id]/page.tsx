"use client";

import ChatTextField from "@/components/ChatComponents/chatTextField";
import MessagePage from "@/components/ChatComponents/MessagePage";
import { getUser } from "@/hooks/profileHooks";
import { UserDetails } from "@/types/UserDetails.type";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function Chat() {
  const params = useParams();
  const id = params?.id as string;
  const defImg = "/def.png";
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the main container

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

  // Handle Mobile Keyboard Viewport Adjustments
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      if (containerRef.current && window.visualViewport) {
        // Set the height of the container to exactly the visible area
        containerRef.current.style.height = `${window.visualViewport.height}px`;

        // Ensure the layout scrolls to the bottom to keep the input visible
        window.scrollTo(0, 0);
      }
    };

    window.visualViewport.addEventListener("resize", handleResize);
    return () =>
      window.visualViewport?.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className=" flex flex-col text-white transition-[height] duration-300 bg-black/30"
      style={{ height: "calc(100vh - 75px)" }} // Fallback height
    >
      {/* Header */}
      <div className="flex items-center space-x-4 bg-gradient-to-r from-[rgb(0,12,60)] to-[rgb(0,0,0)] p-2 shadow-lg backdrop-blur-md border-b border-blue-400 mt-1.5 shrink-0">
        <img
          src={chatUser?.dp || defImg}
          alt={`${chatUser?.name || "User"}'s profile picture`}
          className="h-12 w-12 rounded-full object-cover shadow-sm"
        />
        <span className="text-lg font-semibold">{chatUser?.name}</span>
      </div>

      {/* Message Page - use flex-1 to occupy remaining space */}
      <div className="flex-1 overflow-hidden p-1 min-h-0">
        <MessagePage id={id} />
      </div>

      {/* Chat Input - Ensure it's outside the scrolling area */}
      <div className="shrink-0">
        <ChatTextField id={id} />
      </div>
    </div>
  );
}
