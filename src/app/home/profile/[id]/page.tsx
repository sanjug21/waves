'use client';

import Loader from "@/components/Loader";
import PostCard from "@/components/PostCard";
import { UserProfile, ProfilePageProps, Post, BasicUserDetails } from "@/lib/types";
import { useAppSelector } from "@/store/hooks";
import API from "@/utils/api";
import { get } from "http";
import { set } from "mongoose";
import { useState, useEffect} from "react";
import * as React from 'react'
export default  function ProfilePage({ params }: ProfilePageProps) {
    // const { id } = React.use(params);
    const { id } = params;
    const defImage = '/def.png';

    const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'posts' | 'following' | 'followers'>('posts');

    const [isFollowing, setIsFollowing] = useState(false);
    const [followBtnHover, setFollowBtnHover] = useState(false);

    const [follower,setFollower] = useState<BasicUserDetails[]>([]);
    const [following,setFollowing] = useState<BasicUserDetails[]>([]);


    const currUserId = useAppSelector(state => state.auth.user?._id);
    const isOwner = currUserId === id;

    useEffect(() => {
        const getUserDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await API.get(`/user/getDetails?id=${id}`);
                const userData = response.data;
                setProfileUser(userData);
                if(currUserId) {
                    setIsFollowing(userData.followers.some((follower: { _id: string }) => follower._id === currUserId));
                }
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch user details.");
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            getUserDetails();
        }
    }, [currUserId, id]);


    const getFollowers = async () => {
        try{
            const response = await API.get(`/user/getFollowers?id=${id}`);
            setFollower(response.data.followers);
            setFollowing(response.data.following);

        }catch (error) {
            console.error("Error fetching user followers:", error);
        }
    }
    // getFollowers()
    useEffect(() => {
        getFollowers();
    }, [isFollowing]);

    const followUnfollowUser = async () => {
        if (!currUserId) {
            setError("You must be logged in to follow/unfollow users.");
            return;
        }

        try {
            const response = await API.post("/user/follow", {
                userId: id
            });
           
            setIsFollowing(!isFollowing);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to follow/unfollow user.");
        }
    };

    if (loading) {
        return <Loader/>;
    }
    if (error) {
        return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
    }
    if (!profileUser) {
        return <div className="text-center text-gray-400 mt-10">No user found.</div>;
    }

    const activeTabClass = "border-b-2 border-blue-400 text-white";
    const inactiveTabClass = "text-gray-400";

    return (
        <div className="text-white bg-blue-200 font-sans space-y-2 overflow-y-auto">
            <div className="relative bg-slate-200 NavBg shadow-2xl p-2 pt-5 transition-all duration-300 ease-in-out rounded-b-lg">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-1 sm:space-y-0 sm:space-x-8">
                    <img
                        className="w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover border-2 border-[rgb(0,12,60)] shadow-lg z-20"
                        src={profileUser.dp || defImage}
                        alt={`${profileUser.name}'s profile picture`}
                    />
                    <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                        <h1 className="text-3xl sm:text-4xl font-normal    ">
                            {profileUser.name}
                        </h1>
                        <p className="text-sm text-gray-400 my-2">{profileUser.email}</p>
                        {profileUser.bio && (
                            <p className="text-gray-300 mt-2 max-w-full text-clip overflow-hidden">
                                {profileUser.bio}
                            </p>
                        )}
                        {!isOwner && (
                            <div className="flex space-x-2">
                                <button className="bg-blue-500 text-white py-1 px-3 rounded" onClick={followUnfollowUser}> {isFollowing ? "Unfollow" : "Follow"}</button>
                                <button className="bg-blue-500 text-white py-1 px-3 rounded"> message</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-around p-1 pl-2 pr-2 NavBg text-xl rounded-t-lg">
                <button
                    onClick={() => setActiveTab('posts')}
                    className={`py-2 px-4 ${activeTab === 'posts' ? activeTabClass : inactiveTabClass}`}
                >
                     Posts
                </button>
                <button
                    onClick={() => setActiveTab('following')}
                    className={`py-2 px-4 ${activeTab === 'following' ? activeTabClass : inactiveTabClass}`}
                >
                    Following
                </button>
                <button
                    onClick={() => setActiveTab('followers')}
                    className={`py-2 px-4 ${activeTab === 'followers' ? activeTabClass : inactiveTabClass}`}
                >
                    Followers
                </button>
            </div>

            <div className=" ">
                {activeTab === 'posts' && (
                    <div>
                        {profileUser.posts && profileUser.posts.length > 0 ? (
                            <div className="space-y-3">
                                {profileUser.posts.map((post: Post) => (
                                  <PostCard key={post._id} post={post} />
            ))}
                            </div>
                        ) : (
                            <p>This user has no posts yet.</p>
                        )}
                    </div>
                )}

                {activeTab === 'following' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Following</h2>
                        {profileUser.following && profileUser.following.length > 0 ? (
                            <ul>
                              
                            </ul>
                        ) : (
                            <p>This user isn't following anyone.</p>
                        )}
                    </div>
                )}

                {activeTab === 'followers' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Followers</h2>
                        {profileUser.followers && profileUser.followers.length > 0 ? (
                            <ul>
                                
                            </ul>
                        ) : (
                            <p>This user has no followers yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}