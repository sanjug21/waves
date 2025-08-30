'use client';

import { useEffect, useState } from "react";
import { getFollowing } from "@/hooks/profileHooks";
import { IdProp, UserDetails } from "@/types/types";
import Loader from "../Loader";
import UserCard from "../UserCard";
import UserCardSkeleton from "../skeleton/UserCardSkeleton";

export default function UserFollowings({ id }: IdProp) {
  const [followings, setFollowings] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowings = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getFollowing(id);
        setFollowings(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch followings.");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowings();
  }, [id]);

   if (loading){
      return(
          <div className="space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
          <UserCardSkeleton key={i} />
        ))}
      </div>
      )
  }
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-2">
      {followings.length === 0 ? (
        <p className="text-gray-500 text-center">Not following anyone yet.</p>
      ) : (
        <div className="space-y-2">
          {followings.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
