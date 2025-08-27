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

export default function ProfilePage() {
    const params=useParams()
    const id = params?.id as string;
    const defImage = '/def.png';

    const [isLoading, setIsLoading] = useState(true);
    const [profileUser, setProfileUser] = useState<UserDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'posts' | 'following' | 'followers'>('posts');
    const [isFollowing, setIsFollowing] = useState(false);
    

    const [followers, setFollowers] = useState<UserDetails[]>([]);
    const [following, setFollowing] = useState<UserDetails[]>([]);
    const [followersLoading, setFollowersLoading] = useState(false);
    const [followingLoading, setFollowingLoading] = useState(false);

    const currentUser = useAppSelector((state) => state.auth.user);
    const currUserId = currentUser?._id;
    const isOwner = currUserId === id;

    useEffect(() => {
        if (!currUserId || !id) {
            setIsLoading(false);
            return;
        }

        const getUserDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getUser(id);
                setProfileUser(data);
                setIsFollowing(data.followers.includes(currUserId));
                
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch user details.");
            } finally {
                setIsLoading(false);
            }
        };


        getUserDetails();
        

    }, [currUserId, id]);

    if (!currentUser) {
        return <Loader />;
    }

   

    const followToggle = async () => {
        if (!currentUser) return;
        const wasFollowing = isFollowing;
        setIsFollowing(!wasFollowing);

        try {
            await followUnfollowUser(id);

            if (wasFollowing) {
                setFollowers((prev) => prev.filter((f) => f._id !== currUserId));
            } else if (followers.length > 0) {
                 const followerData: UserDetails = {
                    _id: currentUser._id,
                    name: currentUser.name,
                    email: currentUser.email,
                    dp: currentUser.dp,
                    bio: currentUser.bio || "",
                };
                setFollowers((prev) => [...prev, followerData]);
            }
        } catch (err: any) {
            setIsFollowing(wasFollowing);
            setError(err.response?.data?.message || "Action failed. Please try again.");
        }
    };
    
    const handleTabClick = async (tab: 'posts' | 'following' | 'followers') => {
        setActiveTab(tab);

        if (tab === 'followers' && followers.length === 0) {
            setFollowersLoading(true);
            try {
                const data = await getFollowers(id);
                setFollowers(data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch followers.");
            } finally {
                setFollowersLoading(false);
            }
        }

        if (tab === 'following' && following.length === 0) {
            setFollowingLoading(true);
            try {
                const data = await getFollowing(id);
                setFollowing(data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch following list.");
            } finally {
                setFollowingLoading(false);
            }
        }
    };

    const activeTabClass = "border-b-2 border-blue-400 text-white";
    const inactiveTabClass = "text-gray-400";
    
    if (isLoading) return <Loader />;

    return (
        <div className="text-white bg-blue-200 font-sans overflow-y-auto">
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

            <div className="bg-blue-200 min-h-[calc(100vh-350px)]">
                {activeTab === 'posts' && (
                    <ProfilePosts id={id}/>
                )}

                {activeTab === 'following' && (
                    <div>
                        {followingLoading ? (
                            <Spinner />
                        ) : following.length > 0 ? (
                            <div>
                                {following.map((user: UserDetails) => (
                                    <UserCard key={user._id} user={user} />
                                ))}
                            </div>
                        ) : (
                            <p>This user isn't following anyone.</p>
                        )}
                    </div>
                )}

                {activeTab === 'followers' && (
                    <div>
                        {followersLoading ? (
                            <Spinner />
                        ) : followers.length > 0 ? (
                            <div className="space-y-1">
                                {followers.map((user: UserDetails) => (
                                    <UserCard key={user._id} user={user} />
                                ))}
                            </div>
                        ) : (
                            <p>This user has no followers yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}