'use client'
import React, { useEffect, useState, useCallback } from 'react';
import Loader from '@/components/Util/Loader';
import API from '@/utils/api';
import { Post } from '@/types/types';
import PostCard from '@/components/Cards/PostCard';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get('/posts/getpost');
      
      setPosts(response.data.posts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

 

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="w-full text-center text-red-500 mt-20">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full ">
      <div className="w-full p-2 pl-4 mx-auto mt-2">
       
        {posts.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500 mt-20">
            <h2 className="text-2xl font-semibold">No Posts Yet</h2>
            <p className="mt-2">It's quiet in here... be the first to share something!</p>
          </div>
        ) : (
          <div className="space-y-6 w-full">
            {posts.map((post: Post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}