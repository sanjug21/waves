'use client';

import { useEffect, useState } from "react";
import { getFollowers } from "@/hooks/profileHooks";
import Loader from "../Util/Loader";
import UserCard from "../Cards/UserCard";
import UserCardSkeleton from "../skeleton/UserCardSkeleton";
import { IdProp } from "@/types/Props.types";
import { UserDetails } from "@/types/UserDetails.tpye";

export default function UserFollowers({ id }: IdProp) {
  const [followers, setFollowers] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowers = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getFollowers(id);
      setFollowers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch followers.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFollowers();
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
  if (error) return <button onClick={fetchFollowers} className="rounded bg-orange-400 text-white">refresh</button>;

  return (
    <div className="max-w-3xl mx-auto ">
      {followers.length === 0 ? (
        <p className="text-gray-500 text-center">No followers yet.</p>
      ) : (
        <div className="space-y-2">
          {followers.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
