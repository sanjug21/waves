'use client';

import { useState, useEffect } from "react";
import Loader from "@/components/Loader";
import PostCard from "@/components/PostCard";
import UserCard from "@/components/UserCard";
import {
    followUnfollowUser,
    getFollowers,
    getFollowing,
    getPosts,
    getUser,
} from "@/lib/hooks/profileHooks";
import { IdProps, Post, UserDetails } from "@/lib/types";
import { useAppSelector } from "@/store/hooks";

export default function ProfilePage({ params }: IdProps) {
    const { id } = params;
    const defImage = '/def.png';

    const [isLoading, setIsLoading] = useState(true);
    const [profileUser, setProfileUser] = useState<UserDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'posts' | 'following' | 'followers'>('posts');
    const [isFollowing, setIsFollowing] = useState(false);
    
    const [posts, setPosts] = useState<Post[]>([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);

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

        const getUserPosts = async () => {
            try {
                const postData = await getPosts(1, 10, id);
                setPosts(postData.posts);
                setHasMorePosts(postData.hasMore);
                setCurrentPage(1);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to fetch user posts.");
            } finally {
                setIsLoading(false);
            }
        };

        getUserDetails();
        getUserPosts();

    }, [currUserId, id]);

    if (!currentUser) {
        return <Loader />;
    }

    const fetchMorePosts = async () => {
        if (postsLoading || !hasMorePosts) return;

        setPostsLoading(true);
        try {
            const nextPage = currentPage + 1;
            const data = await getPosts(nextPage, 10, id);
            setPosts((prevPosts) => [...prevPosts, ...data.posts]);
            setHasMorePosts(data.hasMore);
            setCurrentPage(nextPage);
        } catch (err) {
            setError("Failed to fetch more posts.");
        } finally {
            setPostsLoading(false);
        }
    };

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
            <div className="relative bg-slate-200 NavBg shadow-2xl p-4 pt-5 transition-all duration-300 ease-in-out rounded-b-lg mb-2">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8">
                    <img
                        className="w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-[rgb(0,12,60)] shadow-lg"
                        src={profileUser?.dp || defImage}
                        alt={`${profileUser?.name}'s profile picture`}
                    />
                    <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left mt-4 sm:mt-0">
                        <h1 className="text-3xl sm:text-4xl font-bold">
                            {profileUser?.name}
                        </h1>
                        <p className="text-sm text-gray-400 my-2">{profileUser?.email}</p>
                        {profileUser?.bio && (
                            <p className="text-gray-300 mt-2 max-w-full">
                                {profileUser.bio}
                            </p>
                        )}
                        {!isOwner && (
                            <div className="flex space-x-4 mt-4">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors" onClick={followToggle}>
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </button>
                                <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg transition-colors">
                                    Message
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="flex justify-around p-1 pl-2 pr-2 NavBg text-xl rounded-t-lg">
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

            <div className="bg-blue-200 min-h-[500px]">
                {activeTab === 'posts' && (
                    <div className="space-y-4">
                        {posts.length > 0 ? (
                            posts.map((post) => <PostCard key={post._id} post={post} />)
                        ) : (
                            <p className="text-center text-slate-500 pt-12">This user has no posts yet.</p>
                        )}
                        
                        {postsLoading && <Loader />}

                        {hasMorePosts && !postsLoading && (
                            <div className="flex justify-center mt-6">
                                <button 
                                    onClick={fetchMorePosts} 
                                    className="px-6 py-2 rounded-full font-semibold bg-slate-700 hover:bg-slate-600 transition-colors duration-200 text-white"
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'following' && (
                    <div>
                        {followingLoading ? (
                            <Loader />
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
                            <Loader />
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