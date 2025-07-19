'use client'
import React, { useEffect, useState } from 'react';
import { Post } from '@/models/post.model';
import { getAllPosts } from '@/lib/firebase/posts';
import PostCard from '@/components/PostCard';
import Loader from '@/components/Loader'; // Assuming you have a Loader component

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This function sets up a real-time listener for posts.
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

    // This cleanup function will run when the component unmounts,
    // preventing memory leaks by unsubscribing from the listener.
    return () => {
      unsubscribe();
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  // Display a loader while data is being fetched
  if (loading) {
    return <Loader />;
  }

  // Display an error message if the fetch fails
  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-hidden-style">
      <div className="w-full p-4 mx-auto">
        {posts.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500 mt-20">
            <h2 className="text-2xl font-semibold">No Posts Yet</h2>
            <p className="mt-2">It's quiet in here... be the first to share something!</p>
          </div>
        ) : (
          <div className="space-y-6 w-full"> 
            {posts.map((post) => (
               <PostCard key={post.postId} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
