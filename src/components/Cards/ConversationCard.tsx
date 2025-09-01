"use client";

import { ConversationDetails } from "@/types/types";
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
      className={`relative flex items-center gap-4 p-4 rounded-lg shadow-sm transition ${
        isUnseen
          ? "bg-orange-50 hover:bg-orange-100"
          : "bg-white hover:bg-gray-50"
      }`}
    >
      {/* 🔔 New message badge */}
      {isUnseen && (
        <span className="absolute top-2 right-3 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow-sm">
          New message
        </span>
      )}

      <img
        src={otherUser.dp || "/def.png"}
        alt={otherUser.name}
        className="w-11 h-11 rounded-full object-cover border border-gray-300"
      />
      <div className="flex flex-col justify-center">
        <span className="text-sm font-semibold text-gray-900">
          {otherUser.name}
        </span>
        <span
          className={`text-xs truncate max-w-xs ${
            isUnseen ? "text-orange-600 font-medium" : "text-gray-500"
          }`}
        >
          {conversation.lastMessage || "No messages yet"}
        </span>
      </div>
    </Link>
  );
}
