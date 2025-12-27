"use client";

import { getSocket } from "@/lib/socket";
import { useAppSelector } from "@/store/hooks";
import { SendMessagePayload } from "@/types/Conversation.type";
import { IdProp } from "@/types/Props.types";
import { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";

export default function ChatTextField({ id }: IdProp) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState<string>("");
  const currentUser = useAppSelector((state) => state.auth.user);

  // Auto-resize logic
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!currentUser || message.trim() === "") return;

    const socket = getSocket();
    const payload: SendMessagePayload = {
      message: message.trim(),
      senderId: currentUser._id,
      receiverId: id,
    };

    socket.emit("sendMessage", payload);
    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    /* 1. WRAPPER: Differentiates the input area from the chat list 
       Adds a subtle solid tint to anchor the bottom of the screen */
    <div className="w-full  backdrop-blur-md border-t border-white/5 p-2">
      <div className="max-w-4xl mx-auto relative flex items-center">
        {/* 2. THE INPUT FIELD */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a wave..."
          rows={1}
          className="w-full px-5 py-3 pr-14 resize-none bg-white/[0.1] backdrop-blur-3xl border border-white/20 rounded-[1.8rem] text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.15] transition-all duration-300 min-h-[50px] max-h-32 scrollbar-hide leading-normal flex items-center"
          aria-label="Chat message input"
        />

        {/* 3. SEND BUTTON: Centered vertically using absolute positioning 
            'top-1/2 -translate-y-1/2' ensures it's always in the middle */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <button
            onClick={handleSend}
            disabled={message.trim() === ""}
            className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center ${
              message.trim() === ""
                ? "text-gray-500 opacity-20 scale-90"
                : "text-white bg-gradient-to-tr from-blue-500 to-purple-600 shadow-lg shadow-blue-500/40 scale-100 active:scale-90 hover:brightness-110"
            }`}
          >
            <IoMdSend className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
