"use client";

import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Link from "next/link";
import { PostPreviewProps } from "@/types/Props.types";
import { Heart, MessageCircle, X } from "lucide-react"; // Matching your icon set

export default function PostPreview({
  post,
  onClose,
  initialTab = "likes",
}: PostPreviewProps) {
  const [activeTab, setActiveTab] = useState<"likes" | "comments">(initialTab);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const defaultDp = "/def.png";

  const maxLength = 150;
  const isLongDescription =
    post.description && post.description.length > maxLength;
  const displayedDescription =
    showFullDescription || !isLongDescription
      ? post.description
      : post.description?.slice(0, maxLength) + "...";

  return (
    <div className="fixed inset-0 z-[100] w-full h-full flex items-center justify-center p-0 md:p-10 animate-in fade-in zoom-in-95 duration-300">
      {/* Backdrop Blur Layer */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Main Glass Container */}
      <div className="relative w-full h-full md:h-[90vh] md:max-w-6xl bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row rounded-none md:rounded-[2.5rem]">
        {/* CLOSE BUTTON (Floating) */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-50 p-2 rounded-full bg-black/40 border border-white/10 text-white hover:bg-red-500/20 transition-all active:scale-90"
        >
          <X size={20} />
        </button>

        {/* LEFT SIDE: Media & Description */}
        <div className="flex-[1.5] flex flex-col h-full overflow-hidden bg-black/20">
          {/* Header (User Info) */}
          <div className="p-6 border-b border-white/5 flex items-center gap-4">
            <Link
              href={`/home/profile/${post.userId._id}`}
              className="flex items-center gap-4 group"
            >
              <img
                src={post.userId.dp || defaultDp}
                alt={post.userId.name}
                className="h-12 w-12 rounded-full object-cover border-2 border-white/10 group-hover:border-blue-400 transition-all"
              />
              <span className="font-black text-white text-xl tracking-tight group-hover:text-blue-400 transition-colors">
                {post.userId.name}
              </span>
            </Link>
          </div>

          {/* Scrollable Content (Image + Text) */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {post.imageUrl && (
              <div className="relative rounded-[1.5rem] overflow-hidden border border-white/10 shadow-2xl bg-black/40">
                <img
                  src={post.imageUrl}
                  alt="Post content"
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>
            )}

            {post.description && (
              <div className="mt-6 px-2">
                <p className="text-slate-200 text-base leading-relaxed whitespace-pre-wrap font-medium">
                  {displayedDescription}
                </p>
                {isLongDescription && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-400 font-black text-xs uppercase tracking-widest mt-2 hover:underline"
                  >
                    {showFullDescription ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Interactions Panel */}
        <div className="flex-1 flex flex-col border-l border-white/10 bg-white/[0.02]">
          {/* Tab Switcher */}
          <div className="flex border-b border-white/5">
            <button
              onClick={() => setActiveTab("likes")}
              className={`flex-1 py-5 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === "likes"
                  ? "text-white bg-white/5 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              <Heart
                size={14}
                className={activeTab === "likes" ? "fill-current" : ""}
              />
              {post.likes.length} Likes
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`flex-1 py-5 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === "comments"
                  ? "text-white bg-white/5 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              <MessageCircle size={14} />
              {post.comments?.length || 0} Comments
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {activeTab === "likes" ? (
              post.likes.length > 0 ? (
                <div className="space-y-4">
                  {post.likes.map((user) => (
                    <Link
                      key={user._id}
                      href={`/home/profile/${user._id}`}
                      className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
                    >
                      <img
                        src={user.dp || defaultDp}
                        className="h-10 w-10 rounded-full object-cover border border-white/10"
                        alt=""
                      />
                      <span className="text-white font-bold text-sm">
                        {user.name}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-10 text-xs uppercase tracking-widest font-bold">
                  No waves yet
                </p>
              )
            ) : (
              <p className="text-gray-500 text-center py-10 text-xs uppercase tracking-widest font-bold">
                Comments coming soon
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
