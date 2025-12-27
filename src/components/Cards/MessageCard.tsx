"use client";

import { ChatMessage } from "@/types/Conversation.type";
import { useAppSelector } from "@/store/hooks";
import { AiOutlineFileText } from "react-icons/ai";

export default function MessageCard({ message }: { message: ChatMessage }) {
  const currentUserId = useAppSelector((state) => state.auth.user?._id);
  const isOwnMessage = message.senderId === currentUserId;

  return (
    <div
      className={`flex w-full mb-2 ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`relative max-w-[75%] md:max-w-[55%] p-2.5 px-4 backdrop-blur-2xl transition-all border ${
          isOwnMessage
            ? "bg-blue-500/15 border-blue-400/20 text-white rounded-[1.4rem] rounded-br-none"
            : "bg-white/[0.06] border-white/10 text-slate-100 rounded-[1.4rem] rounded-bl-none"
        }`}
      >
        {/* IMAGE CONTENT */}
        {message.image && (
          <div className="relative mb-1.5 overflow-hidden rounded-xl border border-white/10">
            <img
              src={message.image}
              alt="Sent content"
              className="w-full h-auto object-cover max-h-80"
            />
          </div>
        )}

        {/* VIDEO CONTENT */}
        {message.video && (
          <div className="relative mb-1.5 overflow-hidden rounded-xl border border-white/10">
            <video controls className="w-full max-h-80 outline-none">
              <source src={message.video} type="video/mp4" />
            </video>
          </div>
        )}

        {/* AUDIO CONTENT */}
        {message.audio && (
          <div className="mb-1.5 p-1 bg-black/20 rounded-full border border-white/5">
            <audio controls className="w-full h-7">
              <source src={message.audio} type="audio/mpeg" />
            </audio>
          </div>
        )}

        {/* FILE DOWNLOAD - SLIM VERSION */}
        {message.file && (
          <a
            href={message.file}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 mb-1.5 bg-black/20 rounded-xl border border-white/5 hover:bg-black/40 transition-colors"
          >
            <AiOutlineFileText
              size={18}
              className="text-blue-400 flex-shrink-0"
            />
            <span className="text-xs text-white truncate font-medium">
              Download Attachment
            </span>
          </a>
        )}

        {/* TEXT CONTENT */}
        {message.message && (
          <p className="text-[14px] leading-snug whitespace-pre-wrap font-medium">
            {message.message}
          </p>
        )}
      </div>
    </div>
  );
}
