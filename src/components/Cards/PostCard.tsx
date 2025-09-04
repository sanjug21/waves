"use client";

import React, { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { Post } from "@/types/types";
import ImagePreview from "@/components/Util/ImagePreview";
import { toggleLike } from "@/hooks/postHooks";
import { useAppSelector } from "@/store/hooks";

const PostCard = ({ post }: { post: Post }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showDpPreview, setShowDpPreview] = useState(false);
  const [likes, setLikes] = useState(post.likes || []);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  const currentUser = useAppSelector((state) => state.auth.user);
  const [isLiked, setIsLiked] = useState(() =>
    post.likes?.some((user) => user._id === currentUser?._id)
  );

  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const defaultDp = "/def.png";

  useEffect(() => {
    const checkOverflow = () => {
      if (descriptionRef.current) {
        const hasOverflow =
          descriptionRef.current.scrollHeight >
          descriptionRef.current.clientHeight;
        setIsOverflowing(hasOverflow);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [post.description]);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleLikes = async () => {
    if (!currentUser) return;

    const previousLikes = likes;
    const previousIsLiked = isLiked;

    const optimisticLike = {
      _id: currentUser._id,
      name: currentUser.name,
      dp: currentUser.dp || defaultDp,
    };

    if (previousIsLiked) {
      setLikes(previousLikes.filter((user) => user._id !== currentUser._id));
      setIsLiked(false);
    } else {
      setLikes([...previousLikes, optimisticLike]);
      setIsLiked(true);
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 1200);
    }

    try {
      const response = await toggleLike(post._id);
      if (!response.success) {
        throw new Error("API call failed");
      }
    } catch (error) {
      console.error("Failed to toggle like. Reverting changes.");
      setLikes(previousLikes);
      setIsLiked(previousIsLiked);
    }
  };

  const handleDoubleClickLike = () => {
    if (isLiked) {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 1200);
    } else {
      toggleLikes();
    }
  };

  const userProfilePic = post.userId.dp || defaultDp;

  return (
    <>
      <div className="rounded-xl border border-gray-700 bg-black/30 shadow-lg max-w-[750px] mx-auto font-sans overflow-hidden backdrop-blur-3xl relative">
        <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-700">
          <img
            src={userProfilePic}
            alt={`${post.userId.name}'s profile`}
            className="h-10 w-10 rounded-full object-cover border border-gray-500 cursor-pointer"
            onError={(e) => {
              e.currentTarget.src = defaultDp;
            }}
            onClick={() => setShowDpPreview(true)}
          />
          <div className="flex flex-col flex-grow">
            <h3 className="text-sm font-semibold text-white">
              {post.userId.name}
            </h3>
            <time className="text-xs text-gray-400">
              {formatDate(post.createdAt)}
            </time>
          </div>
        </div>

        <div>
          {post.description && (
            <div className="p-4">
              <p
                ref={descriptionRef}
                className={`text-sm text-white whitespace-pre-wrap break-words transition-all ${
                  isExpanded ? "max-h-none" : "max-h-24 line-clamp-4"
                }`}
              >
                {post.description}
              </p>
              {isOverflowing && !isExpanded && (
                <button
                  onClick={toggleExpanded}
                  className="text-indigo-400 hover:underline text-xs mt-1"
                >
                  Show more
                </button>
              )}
              {isExpanded && (
                <button
                  onClick={toggleExpanded}
                  className="text-indigo-400 hover:underline text-xs mt-1"
                >
                  Show less
                </button>
              )}
            </div>
          )}

          {post.imageUrl && (
            <div
              className="max-h-[500px] bg-black/20 overflow-hidden cursor-pointer"
              onDoubleClick={handleDoubleClickLike}
            >
              <img
                src={post.imageUrl}
                alt="Post content"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        <div className="flex border-t border-gray-700 bg-black/20 px-5 py-3">
          <div className="w-full flex justify-around">
            <div className="flex items-center gap-1.5 text-gray-300 relative">
              <button onClick={toggleLikes}>
                <Heart
                  size={18}
                  className={`transition-colors ${
                    isLiked
                      ? "text-pink-500 fill-pink-500 hover:fill-pink-500 hover:text-pink-500"
                      : "hover:text-orange-400"
                  }`}
                />
              </button>
              <span className="text-sm text-gray-200">
                {likes.length} Likes
              </span>
            </div>

            <button className="flex items-center gap-1.5 text-gray-300 hover:opacity-80 transition-opacity">
              <MessageCircle size={18} className="transform scale-x[-1]" />
              <span className="text-sm text-gray-200">
                {post.comments?.length || 0} Comments
              </span>
            </button>
          </div>
        </div>
        {showHeartBurst && <div className="heartBurst" />}
      </div>

      {showImagePreview && post.imageUrl && (
        <ImagePreview
          src={post.imageUrl}
          alt="Post content preview"
          onClose={() => setShowImagePreview(false)}
          username={post.userId.name}
        />
      )}
      {showDpPreview && (
        <ImagePreview
          src={userProfilePic}
          alt={`${post.userId.name}'s profile picture`}
          onClose={() => setShowDpPreview(false)}
          username={post.userId.name}
        />
      )}
    </>
  );
};

export default PostCard;
