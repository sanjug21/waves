'use client';

import { UserProfile, ProfilePageProps } from "@/lib/types";
import { useAppSelector } from "@/store/hooks";
import API from "@/utils/api";
import { useState, useEffect } from "react";

export default function ProfilePage({ params }: ProfilePageProps) {
    const { id } = params;
    const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [admin, setAdmin] = useState(false);
    const currUserId = useAppSelector(state => state.auth.user?._id);

    useEffect(() => {
        if (currUserId === id) {
            setAdmin(true);
        }

        const getUserDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await API.get(`/user/getDetails?id=${id}`);
                const userData = response.data;
                setProfileUser(userData);
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

    const defImage = '/def.png';

    if (loading) {
        return <div className="text-center text-lg mt-10 text-gray-400">Loading profile...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
    }

    if (!profileUser) {
        return <div className="text-center text-gray-400 mt-10">No user found.</div>;
    }
    
    const isFollowing = profileUser.followers.includes(currUserId || '');

    return (
        <div className="min-h-screen  text-white p-4 sm:p-8 font-sans">
            <div className="relative max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-10 transition-all duration-300 ease-in-out">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
                    <img 
                        className="w-32 h-32 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-gray-700 shadow-md" 
                        src={profileUser.dp || defImage} 
                        alt={`${profileUser.name}'s profile picture`} 
                    />
                    <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                        <div className="flex items-center space-x-4 mb-2">
                            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                                {profileUser.name}
                            </h1>
                            {profileUser ? (
                                <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200" aria-label="Settings">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 0 0 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            ) : (
                                <button
                                    className={`p-2 px-4 rounded-full font-bold transition-all duration-300 ease-in-out transform hover:scale-105 ${
                                        isFollowing 
                                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                >
                                    {isFollowing ? "Following" : "Follow"}
                                </button>
                            )}
                        </div>
                        <p className="text-sm text-gray-400 mb-4">{profileUser.email}</p>
                        {profileUser.bio && (
                            <p className="text-gray-300 mt-2 max-w-full text-clip overflow-hidden">
                                {profileUser.bio}
                            </p>
                        )}
                        <div className="flex space-x-6 mt-6">
                            <div className="text-center">
                                <span className="block text-xl font-semibold">{profileUser.followers.length}</span>
                                <span className="text-sm text-gray-400">Followers</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-xl font-semibold">{profileUser.following.length}</span>
                                <span className="text-sm text-gray-400">Following</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 max-w-4xl mx-auto text-center p-6 bg-gray-800 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-300">Waves</h2>
                <p className="text-gray-500 mt-2">Posts will be loaded here.</p>
            </div>
        </div>
    );
}