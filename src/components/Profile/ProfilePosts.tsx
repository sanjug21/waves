import { getPosts } from "@/hooks/profileHooks";
import { useEffect, useState } from "react";
import PostCard from "../Cards/PostCard";
import { Spinner } from "../Util/Loader";
import PostCardSkeleton from "../skeleton/PostCardSkeleton";
import { IdProp } from "@/types/Props.types";
import { Post } from "@/types/PostDetails.type";

export default function ProfilePosts({id}:IdProp) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function getUserPosts() {
    setLoading(true);
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

  if (loading) {
    if (loading) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      );
    }
  }

  if (error)
    return (
      <button
        onClick={getUserPosts}
        className="rounded bg-orange-400 text-white"
      >
        refresh
      </button>
    );


  return (
    <div className="space-y-4 ">
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      ) : (
        <p className="text-center text-slate-500 pt-12">No posts yet.</p>
      )}

      {postsLoading && <Spinner />}

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
  );
}