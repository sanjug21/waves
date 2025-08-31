'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Post } from '@/types/types';
import ImagePreview from '@/components/Util/ImagePreview';

const PostCard = ({ post }: { post: Post }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  // const [likes]
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const defaultDp = "/def.png";

  useEffect(() => {
    if (descriptionRef.current) {
      const hasOverflow = descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight;
      setIsOverflowing(hasOverflow);
    }
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

  // const toggleLike = async (_id: string) => {
  //     const result = await toggleLike(_id);
  //     if (result.success) {
  //       setLikeCount((prev) => (hasLiked ? prev - 1 : prev + 1));
  //       setHasLiked((prev) => !prev);
  //     } else {
  //       console.error(result.message);
  //     }
  // };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm max-w-[750px] mx-auto font-sans overflow-hidden">
        <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
          <img
            src={post.userId.dp || defaultDp}
            alt={`${post.userId.name}'s profile`}
            className="h-10 w-10 rounded-full object-cover border border-gray-300"
            onError={(e) => {
              e.currentTarget.src = defaultDp;
            }}
            onClick={() => setShowPreview(true)}
          />
          <div className="flex flex-col flex-grow">
            <h3 className="text-sm font-semibold text-gray-800">{post.userId.name}</h3>
            <time className="text-xs text-gray-500">{formatDate(post.createdAt)}</time>
          </div>
        </div>

        <div className="px-5 py-4">
          {post.description && (
            <div className="mb-4">
              <p
                ref={descriptionRef}
                className={`text-sm text-gray-700 whitespace-pre-wrap break-words transition-all ${
                  isExpanded ? '' : 'max-h-24 overflow-hidden'
                }`}
              >
                {post.description}
              </p>
              {isOverflowing && (
                <button
                  onClick={toggleExpanded}
                  className="text-indigo-500 hover:underline text-xs mt-1"
                >
                  {isExpanded ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          )}

          {post.imageUrl && (
            <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 bg-gray-100 max-h-[450px]">
              <button onClick={() => setShowPreview(true)} className="w-full h-full focus:outline-none">
                <img
                  src={post.imageUrl}
                  alt="Post content"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </button>
            </div>
          )}
        </div>

        <div className="flex border-t border-gray-100 bg-slate-200 px-5 py-3">
          <div className="w-full flex justify-around">
            <button className="flex items-center gap-1 text-orange-500 hover:text-orange-600">
              <Heart size={18} />
              <span className="text-sm text-gray-700">{post.likes.length} Likes</span>
            </button>

            <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600">
              <span className="text-sm text-gray-700">{post.comments.length} Comments</span>
              <MessageCircle size={18} className="transform scale-x-[-1]" />
            </button>
          </div>
        </div>
      </div>

      {showPreview && (
        <ImagePreview
          src={post.imageUrl || defaultDp}
          alt="Post content"
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
};

export default PostCard;
