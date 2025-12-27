"use client";

import { getPosts } from "@/hooks/profileHooks";
import { useEffect, useState } from "react";
import PostCard from "../Cards/PostCard";
import PostCardSkeleton from "../skeleton/PostCardSkeleton";
import { IdProp } from "@/types/Props.types";
import { Post } from "@/types/PostDetails.type";
import { RefreshCcw, Loader2 } from "lucide-react";

export default function ProfilePosts({ id }: IdProp) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function getUserPosts() {
    setLoading(true);
    setError(null);
    try {
      const postData = await getPosts(1, 10, id);
      setPosts(postData.posts);
      setHasMorePosts(postData.hasMore);
      setCurrentPage(1);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch user posts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserPosts();
  }, [id]);

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

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* MINIMALIST GLASS CONTAINER 
          Using the same sharp edge (rounded-none) and subtle tint 
          as the Followers/Following lists for total consistency.
      */}
      <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-4 md:p-8 min-h-[400px] shadow-2xl rounded-none">
        {loading ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            {Array.from({ length: 2 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <p className="text-red-400 font-medium text-sm bg-red-500/10 px-6 py-2 border border-red-500/20">
              {error}
            </p>
            <button
              onClick={getUserPosts}
              className="flex items-center gap-2 px-8 py-3 bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95"
            >
              <RefreshCcw size={14} /> Refresh Feed
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-30">
            <p className="text-white text-xs font-black uppercase tracking-[0.4em]">
              No waves made yet
            </p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}

            {/* INFINITE LOADING SPINNER */}
            {postsLoading && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin opacity-50" />
              </div>
            )}

            {/* LOAD MORE PILL */}
            {hasMorePosts && !postsLoading && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={fetchMorePosts}
                  className="px-10 py-3 rounded-full bg-white/[0.08] backdrop-blur-3xl border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/20 transition-all duration-300 shadow-2xl active:scale-95"
                >
                  Load More Posts
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
