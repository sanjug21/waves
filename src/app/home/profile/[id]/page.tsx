'use client';

import { useState, useEffect } from "react";
import Loader, { Spinner } from "@/components/Loader";
import PostCard from "@/components/PostCard";
import UserCard from "@/components/UserCard";
import {
    followUnfollowUser,
    getFollowers,
    getFollowing,
    getPosts,
    getUser,
} from "@/hooks/profileHooks";
import {  Post, UserDetails } from "@/types/types";
import { useAppSelector } from "@/store/hooks";
import { useParams } from "next/navigation";
import ProfilePosts from "@/components/profile/ProfilePosts";
import UserProfile from "@/components/profile/UserProfile";
import UserFollowings from "@/components/profile/UserFollowings";
import UserFollowers from "@/components/profile/UserFollowers";

export default function ProfilePage() {
    const params=useParams()
    const id = params?.id as string;
    const defImage = '/def.png';

    const [activeTab, setActiveTab] = useState<'posts' | 'following' | 'followers'>('posts');
  


   

    
    
    const handleTabClick = async (tab: 'posts' | 'following' | 'followers') => {
        setActiveTab(tab);


    };

    const activeTabClass = "border-b-2 border-blue-400 text-white";
    const inactiveTabClass = "text-gray-400";
    

    return (
        <div className="text-white font-sans overflow-y-auto">
            <UserProfile id={id}/>
            
            <div className="flex  justify-around p-1 pl-2 pr-2 NavBg text-xl rounded-t-lg">
                <button
                    onClick={() => handleTabClick('posts')}
                    className={`py-2 px-4 ${activeTab === 'posts' ? activeTabClass : inactiveTabClass}`}
                >
                    Posts
                </button>
                <button
                    onClick={() => handleTabClick('following')}
                    className={`py-2 px-4 ${activeTab === 'following' ? activeTabClass : inactiveTabClass}`}
                >
                    Following
                </button>
                <button
                    onClick={() => handleTabClick('followers')}
                    className={`py-2 px-4 ${activeTab === 'followers' ? activeTabClass : inactiveTabClass}`}
                >
                    Followers
                </button>
            </div>

            <div className="">
                {activeTab === 'posts' && (
                    <ProfilePosts id={id}/>
                )}

                {activeTab === 'following' && (
                    <UserFollowings id={id}/>
                )}

                {activeTab === 'followers' && (
                    <UserFollowers id={id}/>
                )}
            </div>
        </div>
    );
}