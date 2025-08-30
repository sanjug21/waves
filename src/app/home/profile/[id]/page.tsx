'use client';

import { useState } from "react";
import ProfilePosts from "@/components/profile/ProfilePosts";
import UserProfile from "@/components/profile/UserProfile";
import UserFollowings from "@/components/profile/UserFollowings";
import UserFollowers from "@/components/profile/UserFollowers";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const [activeTab, setActiveTab] = useState<'posts' | 'following' | 'followers'>('posts');

  return (
    <div className="max-w-3xl text-white font-sans">
      {/* Profile Header */}
      <UserProfile id={id} />


      <div className="sticky top-1 z-10 NavBg flex justify-around p-1 pl-2 pr-2 text-xl rounded-t-lg">
        <button
          onClick={() => setActiveTab('posts')}
          className={`py-2 px-4 ${activeTab === 'posts' ? 'border-b-2 border-blue-400 text-white' : 'text-gray-400'}`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`py-2 px-4 ${activeTab === 'following' ? 'border-b-2 border-blue-400 text-white' : 'text-gray-400'}`}
        >
          Following
        </button>
        <button
          onClick={() => setActiveTab('followers')}
          className={`py-2 px-4 ${activeTab === 'followers' ? 'border-b-2 border-blue-400 text-white' : 'text-gray-400'}`}
        >
          Followers
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'posts' && <ProfilePosts id={id} />}
        {activeTab === 'following' && <UserFollowings id={id} />}
        {activeTab === 'followers' && <UserFollowers id={id} />}
      </div>
    </div>
  );
}