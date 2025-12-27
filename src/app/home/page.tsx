"use client";

import React, { useEffect, useState, useCallback } from "react";
import Loader from "@/components/Util/Loader";
import API from "@/utils/api";
import { Post } from "@/types/PostDetails.type";
import PostCard from "@/components/Cards/PostCard";
import RecommendedPosts from "@/components/RecommendedPosts";
import { AiOutlineReload } from "react-icons/ai";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        setError(null);
        const currentPage = reset ? 1 : page;
        const response = await API.get("/posts/getpost", {
          params: { page: currentPage },
        });
        const { posts: newPosts } = response.data;

        if (reset) {
          setPosts(newPosts);
          setPage(2);
          setHasMore(newPosts.length === 15);
        } else {
          setPosts((prev) => [...prev, ...newPosts]);
          setPage((prev) => prev + 1);
          setHasMore(newPosts.length === 15);
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    },
    [page]
  );

  useEffect(() => {
    fetchPosts(true);
  }, []);

  if (loading && posts.length === 0) return <Loader />;

  return (
    <main className="min-h-screen text-white pb-20 ">
      {/* Horizontal Recommendations Section */}
      <section className="py-4">
        <RecommendedPosts />
      </section>

      {/* Main Feed Container */}
      <div className="max-w-2xl mx-auto px-4">
        {/* Subtle Feed Divider */}
        <div className="flex items-center gap-4 mb-10 opacity-60">
          <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-blue-400 whitespace-nowrap">
            Main Feed
          </h3>
          <div className="h-[1px] w-full bg-gradient-to-r from-blue-500/50 to-transparent"></div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-[2rem] text-center backdrop-blur-md">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => fetchPosts(true)}
              className="px-6 py-2 bg-red-500/20 border border-red-500/50 text-red-100 rounded-full hover:bg-red-500 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Posts List */}
        <div className="flex flex-col gap-12">
          {posts.length === 0 && !loading ? (
            <div className="py-20 text-center opacity-60">
              <h2 className="text-xl font-medium text-gray-400">
                No waves found...
              </h2>
              <p className="text-sm mt-2">
                Start a conversation to see it here.
              </p>
            </div>
          ) : (
            posts.map((post: Post, index: number) => (
              <div
                key={post._id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <PostCard post={post} />
              </div>
            ))
          )}
        </div>

        {/* Pagination Action */}
        {hasMore && (
          <div className="mt-20 flex flex-col items-center">
            <button
              disabled={loading}
              onClick={() => fetchPosts()}
              className="px-10 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/40 transition-all duration-300 text-sm font-semibold tracking-wide"
            >
              {loading ? "Loading..." : "Load Older Posts"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
