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
  const [showFullDescription, setShowFullDescription] = useState(false);
  const defaultDp = "/def.png";

  const maxLength = 150;
  const isLongDescription =
    post.description && post.description.length > maxLength;
  const displayedDescription =
    showFullDescription || !isLongDescription
      ? post.description
      : post.description.slice(0, maxLength) + "...";

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-black/90 flex flex-col">
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

      {/* Mobile Layout */}
      <div className="flex flex-col sm:hidden p-4 space-y-4">
        {/* Description */}
        {post.description && (
          <div>
            <p className="text-white text-sm whitespace-pre-wrap break-words">
              {displayedDescription}
            </p>
            {isLongDescription && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-orange-400 text-xs mt-1"
              >
                {showFullDescription ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        )}

        {/* Image */}
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post content"
            className="w-full h-auto max-h-[60vh] object-contain rounded-md bg-gray-900 shadow-2xl"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}

        {/* Toggle Buttons */}
        <div className="flex gap-4">
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

        {/* Likes or Comments */}
        <div className="overflow-y-auto max-h-[40vh]">
          {activeTab === "likes" && post.likes.length > 0 ? (
            <ul className="space-y-3">
              {post.likes.map((user) => (
                <li key={user._id} className="flex items-center gap-3">
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

      {/* Desktop Layout */}
      <div className="hidden sm:flex flex-1 overflow-y-auto">
        {/* Left: Description + Image */}
        <div className="flex-1 p-4 flex flex-col justify-start">
          {post.description && (
            <div className="mb-4">
              <p className="text-white text-sm whitespace-pre-wrap break-words">
                {displayedDescription}
              </p>
              {isLongDescription && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-orange-400 text-xs mt-1"
                >
                  {showFullDescription ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post content"
              className="w-full h-auto max-h-[80vh] object-contain rounded-md bg-gray-900 shadow-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </div>

        {/* Right: Likes / Comments Panel */}
        <div className="w-[300px] flex flex-col border-l border-gray-700 p-4">
          {/* Toggle Buttons */}
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
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-160px)]">
            {activeTab === "likes" && post.likes.length > 0 ? (
              <ul className="space-y-3">
                {post.likes.map((user) => (
                  <li key={user._id} className="flex items-center gap-3">
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
