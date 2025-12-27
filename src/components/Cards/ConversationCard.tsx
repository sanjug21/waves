"use client";

import { ConversationDetails } from "@/types/Conversation.type";
import Link from "next/link";

export default function ConversationCard({
  conversation,
}: {
  conversation: ConversationDetails;
}) {
  const isUnseen = !conversation.lastMessageSeen;
  const otherUser = conversation.receiverId;
  const defaultDp = "/def.png";

  return (
    <Link
      href={`/home/chat/${otherUser._id}`}
      className={`group relative flex items-center gap-4 p-4 rounded-[1.8rem] transition-all duration-300 border backdrop-blur-3xl ${
        isUnseen
          ? "bg-white/[0.08] border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
          : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20"
      }`}
    >
      {/* PROFILE IMAGE WITH ONLINE/STATUS RING */}
      <div className="relative flex-shrink-0">
        <img
          src={otherUser.dp || defaultDp}
          alt={otherUser.name}
          className={`w-12 h-12 rounded-full object-cover border-2 transition-transform duration-300 group-hover:scale-105 ${
            isUnseen ? "border-blue-400" : "border-white/20"
          }`}
          onError={(e) => {
            e.currentTarget.src = defaultDp;
          }}
        />
        {isUnseen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-[#000828]"></span>
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-col justify-center flex-grow overflow-hidden">
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-[15px] font-bold text-white tracking-tight truncate">
            {otherUser.name}
          </span>
          {/* Subtle Timestamp - You can add this if your data has it */}
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            {isUnseen ? "Now" : ""}
          </span>
        </div>

        <p
          className={`text-sm truncate transition-colors ${
            isUnseen ? "text-slate-100 font-bold" : "text-gray-400 font-medium"
          }`}
        >
          {conversation.lastMessage || "Start a wave..."}
        </p>
      </div>

      {/* NEW MESSAGE PILL */}
      {isUnseen && (
        <div className="ml-2">
          <div className="bg-blue-500/20 border border-blue-500/50 px-2 py-1 rounded-lg">
            <span className="text-[9px] font-black text-blue-300 uppercase tracking-tighter">
              New
            </span>
          </div>
        </div>
      )}
    </Link>
  );
}
