'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Post } from '@/types/types';

const PostCard = ({ post }: { post: Post }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
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

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 max-w-[750px] mx-auto font-sans">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={post.userId.dp || defaultDp}
          alt={`${post.userId.name}'s profile`}
          className="h-10 w-10 rounded-full object-cover border border-gray-300"
          onError={(e) => {
            e.currentTarget.src = defaultDp;
          }}
        />
        <div className="flex flex-col flex-grow">
          <h3 className="text-sm font-semibold text-gray-800">{post.userId.name}</h3>
          <time className="text-xs text-gray-500">{formatDate(post.createdAt)}</time>
        </div>
      </div>

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
        <div className="mb-4 rounded-lg overflow-hidden border border-gray-100 bg-gray-100">
          <img
            src={post.imageUrl}
            alt="Post content"
            className="w-full max-h-96 object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="flex items-center justify-start gap-6 pt-3 border-t border-gray-100">
        <button className="flex items-center gap-1 text-rose-500 hover:text-rose-600">
          <Heart size={18} />
          <span className="text-sm text-gray-700">{post.likes.length} Likes</span>
        </button>
        <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600">
          <MessageCircle size={18} />
          <span className="text-sm text-gray-700">{post.comments.length} Comments</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;