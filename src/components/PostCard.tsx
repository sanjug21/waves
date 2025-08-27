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

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-blue-200 p-6 rounded-3xl shadow-lg font-sans">
      <div className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl shadow-md p-6 w-full mx-auto">
        <div className="flex items-center mb-4">
          <img
            src={post.userId.dp || defaultDp}
            alt={`${post.userId.name}'s profile picture`}
            className="h-12 w-12 rounded-full object-cover mr-4 border-2 border-gray-200"
            onError={(e) => {
              e.currentTarget.src = defaultDp;
            }}
          />
          <div className="flex-grow">
            <h3 className="font-bold text-lg text-gray-800">{post.userId.name}</h3>
          </div>
          <time className="text-xs text-gray-500 self-start">{formatDate(post.createdAt)}</time>
        </div>

        {post.description && (
          <div className="mb-4">
            <p
              ref={descriptionRef}
              className={`text-gray-700 whitespace-pre-wrap break-words ${
                isExpanded ? 'max-h-none' : 'max-h-24 overflow-hidden'
              }`}
            >
              {post.description}
            </p>
            {isOverflowing && (
              <button
                onClick={toggleExpanded}
                className="text-indigo-500 hover:text-indigo-600 font-semibold mt-1 text-sm"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}

        {post.imageUrl && (
          <div className="mb-4 rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-slate-200">
            <img
              src={post.imageUrl}
              alt="Post content"
              className="w-full h-80 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="flex items-center text-gray-500 space-x-6 border-t border-gray-200 pt-4">
          <button className="flex items-center space-x-2 text-rose-500 hover:text-rose-600 transition-colors duration-200">
            <Heart size={20} />
            <span className="font-medium text-sm text-gray-700">{post.likes.length} Likes</span>
          </button>
          <button className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors duration-200">
            <MessageCircle size={20} />
            <span className="font-medium text-sm text-gray-700">{post.comments.length} Comments</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
