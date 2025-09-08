"use client";

import { ChatMessage } from "@/types/Conversation.type";
import { useAppSelector } from "@/store/hooks";

export default function MessageCard({ message }: { message: ChatMessage }) {
  const currentUserId = useAppSelector((state) => state.auth.user?._id);
  const isOwnMessage = message.senderId === currentUserId;

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[65%] p-2 pl-3 pr-3 rounded-4xl backdrop-blur-lg bg-black/40 text-white ${
          isOwnMessage ? "rounded-br-none" : "rounded-bl-none"
        }`}
      >
        {message.image && (
          <img
            src={message.image}
            alt="Image"
            className="w-full rounded-md mb-2"
          />
        )}
        {message.video && (
          <video controls className="w-full rounded-md mb-2">
            <source src={message.video} type="video/mp4" />
          </video>
        )}
        {message.audio && (
          <audio controls className="w-full mb-2">
            <source src={message.audio} type="audio/mpeg" />
          </audio>
        )}
        {message.file && (
          <a
            href={message.file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-300 underline mb-2 block"
          >
            📎 Download File
          </a>
        )}
        {message.message && (
          <p className="text-sm whitespace-pre-wrap text-white">{message.message}</p>
        )}
      </div>
    </div>
  );
}
