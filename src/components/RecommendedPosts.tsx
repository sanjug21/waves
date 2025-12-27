"use client";

import API from "@/utils/api";
import { useEffect, useState } from "react";
import { RecommendedPost } from "@/types/RecommendedPost";
import PostPreview from "@/components/PostPreview";
import { Post } from "@/types/PostDetails.type";
import { createPortal } from "react-dom";
import { AiOutlineArrowRight } from "react-icons/ai";

export default function RecommendedPosts() {
  const [recommendations, setRecommendations] = useState<RecommendedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const defaultDp = "/def.png";

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.post("/posts/recommendPosts");
      setRecommendations(res.data);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  const fetchPostById = async (id: string) => {
    try {
      const res = await API.get(`/posts/getpostbyid/${id}`);
      setSelectedPost(res.data.post);
    } catch (err: any) {
      console.error("Failed to fetch post:", err);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  // --- SKELETON LOADING STATE ---
  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 mb-8">
        <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse mb-6"></div>
        <div className="flex gap-5 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="min-w-[280px] h-[320px] bg-white/5 rounded-2xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-2xl mx-auto max-w-xl">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchRecommendations}
          className="px-6 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 mb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Discover <span className="text-blue-400">Waves</span>
          </h2>
          <p className="text-gray-200 text-sm mt-1">
            Curated based on your interests
          </p>
        </div>

        {visibleCount < recommendations.length && (
          <button
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="group flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition"
          >
            Explore More{" "}
            <AiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* HORIZONTAL SCROLL CONTAINER */}
      <div className="relative group/scroll">
        <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
          {recommendations.slice(0, visibleCount).map((post) => (
            <div
              key={post.id}
              onClick={() => fetchPostById(post.id)}
              className="snap-start min-w-[280px] max-w-[280px] flex-shrink-0 group cursor-pointer relative"
            >
              {/* Card Container */}
              <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 h-full transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:-translate-y-2">
                {/* User Info Header */}
                {post.user && (
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={post.user.dp || defaultDp}
                      alt={post.user.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/30 group-hover:border-blue-500 transition-colors"
                    />
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                        {post.user.name}
                      </p>
                    </div>
                  </div>
                )}

                {/* Main Image */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.description}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center">
                      <p className="text-xs text-gray-500">No Preview</p>
                    </div>
                  )}

                  {/* Floating Match Score Badge */}
                  {post.score !== undefined && (
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      <p className="text-[10px] font-bold text-blue-300">
                        {Math.round(post.score * 100)}% Match
                      </p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-200 line-clamp-2 leading-relaxed font-medium">
                  {post.description}
                </p>

                {/* Subtle Action Hint */}
                <div className="mt-4 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400">
                    View Detail
                  </span>
                  <AiOutlineArrowRight className="text-blue-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PORTAL MODAL */}
      {selectedPost &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <PostPreview
              post={selectedPost}
              onClose={() => setSelectedPost(null)}
              initialTab="likes"
            />
          </div>,
          document.body
        )}
    </div>
  );
}
