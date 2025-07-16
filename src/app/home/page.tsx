'use client'
import React, { useEffect, useState } from 'react';
import { Post } from '@/models/post.model';
import { getAllPosts } from '@/lib/firebase/posts';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = getAllPosts(
      (newPosts: Post[]) => {
        setPosts(newPosts);
        setLoading(false);
      },
      (err: Error) => {
        console.error("Failed to stream posts:", err);
        setError("Failed to load posts. Please try again later.");
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);



  return (
    <div className="max-w-xl mx-auto my-5 p-5 border border-gray-200 rounded-lg shadow-md">
      <h1 className="text-center mb-6 text-3xl font-bold text-gray-800">Latest Posts</h1>
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available yet. Be the first to create one!</p>
      ) : (
        <div className="space-y-5"> {/* Adds vertical space between post items */}
          {posts.map((post) => (
            <div key={post.postId} className="mb-5 p-4 border border-gray-300 rounded-md bg-white shadow-sm">
              <div className="flex items-center mb-3">
                {post.dp && <img src={post.dp} alt="Profile" className="w-10 h-10 rounded-full mr-3 object-cover" />}
                <h3 className="m-0 text-lg font-semibold text-blue-600">{post.name}</h3>
              </div>
              <p className="leading-relaxed text-gray-700">{post.description}</p>
              {post.postUrl && (
                <div className="text-center mt-4">
                  <img src={post.postUrl} alt="Post content" className="max-w-full h-auto rounded-md border border-gray-200" />
                </div>
              )}
              <div className="flex justify-between mt-4 text-sm text-gray-600">
                <span>Likes: {post.likes?.length || 0}</span>
                <span>Comments: {post.comments?.length || 0}</span>
              </div>
              {post.createdAt && (
                <p className="text-xs text-gray-400 text-right mt-2">
                  Posted on: {new Date(post.createdAt).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;