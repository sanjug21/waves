"use client";

import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Link from "next/link";
import { PostPreviewProps } from "@/types/Props.types";

export default function PostPreview({
  post,
  onClose,
  initialTab = "likes",
}: PostPreviewProps) {
  const [activeTab, setActiveTab] = useState<"likes" | "comments">(initialTab);
  const defaultDp = "/def.png";

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-black/90 ">
      {/* Header */}
      <div className="flex justify-between items-center m-4">
        <Link
          href={`/home/profile/${post.userId._id}`}
          className="flex items-center gap-3"
        >
          <img
            src={post.userId.dp || defaultDp}
            alt={`${post.userId.name}'s profile`}
            className="h-10 w-10 rounded-full object-cover border border-gray-500 cursor-pointer"
            onError={(e) => {
              e.currentTarget.src = defaultDp;
            }}
          />
          <h3 className="font-semibold text-white text-xl">
            {post.userId.name}
          </h3>
        </Link>
        <button onClick={onClose}>
          <AiOutlineClose className="h-5 w-5 text-white hover:text-orange-500" />
        </button>
      </div>

      {/* Scrollable Main Content */}
      <div className="flex flex-col sm:flex-row overflow-y-auto h-screen">
        {/* Image + Description */}
        <div className=" hidden sm:flex flex-1 p-2">
          {post.description && (
            <p className="text-white text-sm whitespace-pre-wrap break-words mb-4">
              {post.description}
            </p>
          )}
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post content"
              className="w-full h-auto min-h-[300px] max-h-[90vh] object-contain rounded-md bg-gray-900 shadow-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </div>

        {/* Likes / Comments Panel */}
        <div className="w-full md:w-[300px] flex flex-col border-t md:border-t-0 md:border-l border-gray-700 p-2">
          {/* Toggle Buttons with Counts */}
          <div className="flex gap-4 mb-2">
            {post.likes.length > 0 && (
              <button
                onClick={() => setActiveTab("likes")}
                className={`text-sm font-semibold ${
                  activeTab === "likes"
                    ? "text-white border-b-2 border-white"
                    : "text-gray-400"
                }`}
              >
                {post.likes.length} Likes
              </button>
            )}
            {post.comments?.length > 0 && (
              <button
                onClick={() => setActiveTab("comments")}
                className={`text-sm font-semibold ${
                  activeTab === "comments"
                    ? "text-white border-b-2 border-white"
                    : "text-gray-400"
                }`}
              >
                {post.comments.length} Comments
              </button>
            )}
          </div>

          {/* Scrollable Likes/Comments */}
          <div className="flex-1 overflow-y-auto scrollbar-hidden-style">
            {activeTab === "likes" && post.likes.length > 0 ? (
              <ul className="space-y-3">
                {post.likes.map((user) => (
                  <li key={user._id} className="flex items-center p-2 rounded-xl gap-3">
                    <img
                      src={user.dp || defaultDp}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover border border-gray-600"
                    />
                    <span className="text-white text-sm">{user.name}</span>
                  </li>
                ))}
              </ul>
            ) : activeTab === "likes" ? (
              <p className="text-gray-400 text-sm">No likes yet.</p>
            ) : null}

            {activeTab === "comments" && post.comments.length > 0 ? (
              <ul className="space-y-3">
                {post.comments.map((comment, idx) => (
                  <li key={idx} className="text-white text-sm">
                    {/* {comment.text} */}
                  </li>
                ))}
              </ul>
            ) : activeTab === "comments" ? (
              <p className="text-gray-400 text-sm">No comments yet.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
