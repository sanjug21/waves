'use client';

import { getUser, checkIsFollowing, followUnfollowUser } from "@/hooks/profileHooks";
import { useAppSelector } from "@/store/hooks";
import { IdProp, UserDetails } from "@/types/types";
import { useEffect, useState } from "react";
import ProfileSkelton from "../skeleton/ProfileSkeleton";
import Link from "next/link";
import { Settings } from "lucide-react";

export default function UserProfile({ id }: IdProp) {
  const [profileUser, setProfileUser] = useState<UserDetails | null>(null);
  const [isFollowing, setIsFollowing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUser = useAppSelector((state) => state.auth.user);
  const currUserId = currentUser?._id;
  const isOwner = currUserId === id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userData = await getUser(id);
        setProfileUser(userData);

        if (!isOwner) {
          const followStatus = await checkIsFollowing(id);
          setIsFollowing(followStatus.isFollowing);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isOwner]);

  const handleFollowToggle = async () => {
    if (!currentUser || actionLoading) return;

    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setActionLoading(true);
    setError(null);

    try {
      await followUnfollowUser(id);
    } catch (err: any) {
      setIsFollowing(wasFollowing);
      setError(err.response?.data?.message || "Action failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <ProfileSkelton />;

return (
  <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl bg-white ">
    {/* Settings Icon for Owner */}
    {isOwner && (
      <Link
        href={`/home/details`}
        className="absolute top-4 right-4 z-10 text-gray-500 hover:text-[rgb(0,12,60)] transition-colors"
        title="Edit Profile"
      >
        <Settings size={22} />
      </Link>
    )}

    {/* Header Section */}
    <div className="relative bg-gradient-to-br from-blue-50 to-purple-100 p-6 sm:p-8">
      <div className="absolute inset-0 bg-gradient-to-r from-[rgb(0,12,60)] to-purple-700 opacity-10 pointer-events-none" />
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
        {/* Avatar */}
        <div className="relative group">
          <img
            src={profileUser?.dp || "/def.png"}
            alt={`${profileUser?.name}'s profile`}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-2 border-[rgb(0,12,60)] shadow-lg transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-36 h-2 bg-gradient-to-r from-blue-400 to-purple-500 blur-sm opacity-30" />
        </div>

                {/* Profile Info */}
        <div className="flex-1 text-center sm:text-left space-y-1">
          <h1 className="text-3xl font-bold text-[rgb(0,12,60)]">
            {profileUser?.name || "Unnamed User"}
          </h1>

          {/* {profileUser?.email && (
            <p className="text-[10px] text-gray-500 italic">{profileUser.email}</p>
          )} */}

          {profileUser?.bio && (
            <p className="text-gray-600  mt-1">{profileUser.bio}</p>
          )}

          {!isOwner && (
            <div className="flex justify-center sm:justify-start gap-4 mt-4">
              <button
                onClick={handleFollowToggle}
                disabled={actionLoading}
                className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 ${
                  isFollowing
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {actionLoading ? (
                  <svg className="w-5 h-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" className="opacity-25" />
                    <path fill="white" d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z" className="opacity-75" />
                  </svg>
                ) : isFollowing ? "Unfollow" : "Follow"}
              </button>
              <button className="px-5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-all duration-200">
                Message
              </button>
            </div>
          )}

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

      </div>
    </div>

    
  </div>
);


}