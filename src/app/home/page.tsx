'use client'
import React, { useEffect, useState } from 'react';
import Loader from '@/components/Loader'; // Assuming you have a Loader component

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-hidden-style">
      {/* <div className="w-full p-4 mx-auto">
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
      </div> */}
    </div>
  );
};

export default Home;
