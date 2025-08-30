'use client';

import { getUser, checkIsFollowing, followUnfollowUser } from "@/hooks/profileHooks";
import { useAppSelector } from "@/store/hooks";
import { IdProp, UserDetails } from "@/types/types";
import { useEffect, useState } from "react";
import ProfilePosts from "./ProfilePosts";
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
    <div className="bg-white shadow-xl rounded-b-xl overflow-hidden max-w-4xl mx-auto mt-2 mb-2 relative">
      {isOwner && (
        <Link
          href={`/home/details`}
          className="absolute top-4 right-4 text-gray-500 hover:text-blue-600 transition-colors duration-200"
          title="Edit Profile"
        >
          <Settings size={20} />
        </Link>
      )}

      <div className="flex flex-col sm:flex-row items-center sm:items-start p-6 sm:p-8 gap-6">
        <div className="relative group">
          <img
            src={profileUser?.dp || "/def.png"}
            alt={`${profileUser?.name}'s profile`}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-2 border-[rgb(0,12,60)] transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            {profileUser?.name || "Add your name"}
          </h1>

          <p className="text-sm text-gray-500">{profileUser?.email || "Add your email"}</p>

          <p className="text-base text-gray-700">
            <span className="font-medium">Nickname:</span>{" "}
            {profileUser?.nickname || "Add your nickname"}
          </p>

          <p className="text-base text-gray-700">
            <span className="font-medium">Bio:</span>{" "}
            {profileUser?.bio || "Add your bio"}
          </p>

          <p className="text-base text-gray-700">
            <span className="font-medium">Phone:</span>{" "}
            {profileUser?.phone || "Add your phone number"}
          </p>

          <p className="text-base text-gray-700">
            <span className="font-medium">Date of Birth:</span>{" "}
            {profileUser?.dob || "Add your date of birth"}
          </p>

          <p className="text-base text-gray-700">
            <span className="font-medium">Address:</span>{" "}
            {profileUser?.address || "Add your address"}
          </p>

          <p className="text-base text-gray-700">
            <span className="font-medium">Gender:</span>{" "}
            {profileUser?.gender || "Add your gender"}
          </p>

          {!isOwner && (
            <div className="flex justify-center sm:justify-start gap-4 mt-4">
              <button
                onClick={handleFollowToggle}
                disabled={actionLoading}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                  isFollowing
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {actionLoading ? (
                  <svg className="w-5 h-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="4"
                      className="opacity-25"
                    />
                    <path
                      fill="white"
                      d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z"
                      className="opacity-75"
                    />
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
  );
}
