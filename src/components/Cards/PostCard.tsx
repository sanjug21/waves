"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom"; // Import createPortal
import { Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import { Post } from "@/types/PostDetails.type";
import ImagePreview from "@/components/Util/ImagePreview";
import { toggleLike } from "@/hooks/postHooks";
import { useAppSelector } from "@/store/hooks";
import PostPreview from "../PostPreview";

const PostCard = ({ post }: { post: Post }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showDpPreview, setShowDpPreview] = useState(false);
  const [likes, setLikes] = useState(post.likes || []);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showPostPreview, setShowPostPreview] = useState(false);
  const [previewTab, setPreviewTab] = useState<"likes" | "comments">("likes");

  // Mounted state to ensure Portals only render on the client
  const [mounted, setMounted] = useState(false);

  const currentUser = useAppSelector((state) => state.auth.user);
  const [isLiked, setIsLiked] = useState(() =>
    post.likes?.some((user) => user._id === currentUser?._id)
  );

  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const defaultDp = "/def.png";

  useEffect(() => {
    setMounted(true); // Component has mounted on the client
    const checkOverflow = () => {
      if (descriptionRef.current) {
        const hasOverflow =
          descriptionRef.current.scrollHeight >
          descriptionRef.current.clientHeight;
        setIsOverflowing(hasOverflow);
      }
    };
    checkOverflow();
  }, [post.description]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const toggleLikes = async () => {
    if (!currentUser) return;
    const previousLikes = likes;
    const previousIsLiked = isLiked;

    if (previousIsLiked) {
      setLikes(previousLikes.filter((user) => user._id !== currentUser._id));
      setIsLiked(false);
    } else {
      setLikes([
        ...previousLikes,
        {
          _id: currentUser._id,
          name: currentUser.name,
          dp: currentUser.dp || defaultDp,
        },
      ]);
      setIsLiked(true);
      triggerHeartBurst();
    }
    try {
      await toggleLike(post._id);
    } catch (error) {
      setLikes(previousLikes);
      setIsLiked(previousIsLiked);
    }
  };

  const triggerHeartBurst = () => {
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 1000);
  };

  const handleImageClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      if (!isLiked) {
        toggleLikes();
      } else {
        triggerHeartBurst();
      }
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        setShowImagePreview(true);
        clickTimeoutRef.current = null;
      }, 300);
    }
  };

  const userProfilePic = post.userId.dp || defaultDp;

  return (
    <>
      <div className="group relative w-full bg-white/[0.08] backdrop-blur-3xl border border-white/20 rounded-[2.5rem] overflow-hidden transition-all duration-300 shadow-2xl mb-6">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-black/20 mb-2">
          <div className="flex items-center gap-3">
            <img
              src={userProfilePic}
              alt={post.userId.name}
              className="h-11 w-11 rounded-full object-cover border-2 border-white/30 cursor-pointer hover:border-blue-400 transition-all shadow-lg"
              onClick={() => setShowDpPreview(true)}
            />
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-white tracking-wide">
                {post.userId.name}
              </h3>
              <p className="text-[10px] text-gray-300 font-bold tracking-tight -mt-0.5 opacity-90">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          <button className="text-gray-300 hover:text-white transition-colors">
            <MoreHorizontal size={22} />
          </button>
        </div>

        {/* DESCRIPTION */}
        {post.description && (
          <div className="px-7 pb-5">
            <p
              ref={descriptionRef}
              className={`text-[16px] leading-relaxed text-slate-100 font-medium whitespace-pre-wrap break-words transition-all ${
                isExpanded ? "max-h-none" : "max-h-24 line-clamp-3"
              }`}
            >
              {post.description}
            </p>
            {isOverflowing && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-300 font-black text-[10px] mt-2 hover:text-white transition-colors uppercase tracking-wider underline decoration-blue-500/50 underline-offset-4"
              >
                {isExpanded ? "Show Less" : "Read Full Post"}
              </button>
            )}
          </div>
        )}

        {/* IMAGE WITH DOUBLE TAP */}
        {post.imageUrl && (
          <div
            className="px-4 pb-4 cursor-pointer group/image relative"
            onClick={handleImageClick}
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 shadow-inner bg-black/20 select-none">
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full h-auto max-h-[600px] object-cover transition-transform duration-700 group-hover/image:scale-[1.02] pointer-events-none"
              />
              {showHeartBurst && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="heartBurst shadow-[0_0_30px_rgba(255,0,255,0.4)]" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-4">
            {/* LIKE PILL */}
            <div
              className={`flex items-center bg-white/5 border border-white/10 rounded-full overflow-hidden transition-all hover:bg-white/10 ${
                isLiked ? "border-pink-500/30 bg-pink-500/5" : ""
              }`}
            >
              <button
                onClick={toggleLikes}
                className="pl-3 pr-2 py-2 group/like transition-all active:scale-125"
              >
                <Heart
                  size={20}
                  className={`${
                    isLiked
                      ? "text-pink-500 fill-pink-500"
                      : "text-white group-hover/like:text-pink-400"
                  } transition-colors`}
                />
              </button>
              <div className="h-4 w-[1px] bg-white/20" />
              <button
                onClick={() => {
                  setPreviewTab("likes");
                  setShowPostPreview(true);
                }}
                className="pl-2 pr-4 py-2 text-sm font-black text-white hover:text-blue-400 transition-colors"
              >
                {likes.length}
              </button>
            </div>

            {/* COMMENT PILL */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full overflow-hidden transition-all hover:bg-white/10">
              <button
                onClick={() => {
                  setPreviewTab("comments");
                  setShowPostPreview(true);
                }}
                className="pl-3 pr-2 py-2 group/comment transition-all"
              >
                <MessageCircle
                  size={20}
                  className="text-white group-hover/comment:text-blue-400 transition-colors"
                />
              </button>
              <div className="h-4 w-[1px] bg-white/20" />
              <div className="pl-2 pr-4 py-2 text-sm font-black text-white">
                {post.comments?.length || 0}
              </div>
            </div>
          </div>

          <button className="p-2.5 bg-white/5 border border-white/10 rounded-full text-white hover:text-blue-400 hover:bg-white/10 transition-all">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* PORTALS rendered at the end of the body */}
      {mounted &&
        showPostPreview &&
        createPortal(
          <PostPreview
            post={post}
            onClose={() => setShowPostPreview(false)}
            initialTab={previewTab}
          />,
          document.body
        )}

      {mounted &&
        (showImagePreview || showDpPreview) &&
        createPortal(
          <ImagePreview
            src={showImagePreview ? post.imageUrl! : userProfilePic}
            alt="Preview"
            onClose={() => {
              setShowImagePreview(false);
              setShowDpPreview(false);
            }}
            username={post.userId.name}
          />,
          document.body
        )}
    </>
  );
};

export default PostCard;
