'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Post } from '@/types/types';
import ImagePreview from '@/components/Util/ImagePreview';

const PostCard = ({ post }: { post: Post }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showDpPreview, setShowDpPreview] = useState(false);

  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const defaultDp = "/def.png";

  useEffect(() => {
    const checkOverflow = () => {
      if (descriptionRef.current) {
        const hasOverflow = descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight;
        setIsOverflowing(hasOverflow);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => window.removeEventListener('resize', checkOverflow);
  }, [post.description]);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const userProfilePic = post.userId.dp || defaultDp;

  return (
    <>
      <div className="rounded-xl border border-gray-700 bg-black/30 shadow-lg max-w-[750px] mx-auto font-sans overflow-hidden backdrop-blur-3xl">
        <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-700">
          <img
            src={userProfilePic}
            alt={`${post.userId.name}'s profile`}
            className="h-10 w-10 rounded-full object-cover border border-gray-500 cursor-pointer"
            onError={(e) => { e.currentTarget.src = defaultDp; }}
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
            <div className="max-h-[500px] bg-black/20">
              <img
                src={post.imageUrl}
                alt="Post content"
                className="h-full w-full object-contain cursor-pointer"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                onClick={() => setShowImagePreview(true)}
              />
            </div>
          )}
        </div>

        <div className="flex border-t border-gray-700 bg-black/20 px-5 py-3">
          <div className="w-full flex justify-around">
            <div className="flex items-center gap-1.5 text-gray-300">
              <Heart size={18} />
              <span className="text-sm text-gray-200">
                {post.likes?.length || 0} Likes
              </span>
            </div>

            <button className="flex items-center gap-1.5 text-gray-300 hover:opacity-80 transition-opacity">
              <MessageCircle size={18} className="transform scale-x-[-1]" />
              <span className="text-sm text-gray-200">
                {post.comments?.length || 0} Comments
              </span>
            </button>
          </div>
        </div>
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