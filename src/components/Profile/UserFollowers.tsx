"use client";

import { useEffect, useState } from "react";
import { getFollowers } from "@/hooks/profileHooks";
import UserCard from "../Cards/UserCard";
import UserCardSkeleton from "../skeleton/UserCardSkeleton";
import { IdProp } from "@/types/Props.types";
import { UserDetails } from "@/types/UserDetails.type";
import { RefreshCcw } from "lucide-react";

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

  return (
    <div className="max-w-3xl mx-auto pb-10">
      {/* MINIMALIST GLASS CONTAINER: 
          - Removed rounded corners (rounded-none)
          - Subtle white tint (bg-white/[0.04])
          - High blur for contrast
      */}
      <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-6 min-h-[300px] shadow-2xl rounded-none">
        {loading ? (
          <div className="space-y-3 animate-in fade-in duration-500">
            {Array.from({ length: 6 }).map((_, i) => (
              <UserCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <p className="text-red-400 font-medium text-sm bg-red-500/10 px-4 py-2 border border-red-500/20">
              {error}
            </p>
            <button
              onClick={fetchFollowers}
              className="flex items-center gap-2 px-6 py-2.5 bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95"
            >
              <RefreshCcw size={14} /> Try Again
            </button>
          </div>
        ) : followers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-30">
            <p className="text-white text-xs font-black uppercase tracking-[0.3em]">
              No followers yet
            </p>
          </div>
        ) : (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {followers.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
