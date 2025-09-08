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

  return (
    <Link
      href={`/home/chat/${otherUser._id}`}
      className={`relative flex items-center gap-4 p-4 rounded-xl shadow-lg transition-colors border ${
        isUnseen
          ? "bg-gray-800/50 border-orange-500/50 hover:bg-gray-800"
          : "bg-black/40 border-gray-800 hover:bg-gray-800/60"
      }`}
    >
      {isUnseen && (
        <span className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow-md">
          New
        </span>
      )}

      <img
        src={otherUser.dp || "/def.png"}
        alt={otherUser.name}
        className="w-11 h-11 rounded-full object-cover border-2 border-gray-700"
      />
      <div className="flex flex-col justify-center overflow-hidden">
        <span className="text-sm font-semibold text-gray-100">
          {otherUser.name}
        </span>
        <p
          className={`text-xs truncate ${
            isUnseen ? "text-orange-400 font-semibold" : "text-gray-400"
          }`}
        >
          {conversation.lastMessage || "No messages yet"}
        </p>
      </div>
    </Link>
  );
}
