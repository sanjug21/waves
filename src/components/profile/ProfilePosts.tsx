import { getPosts } from "@/hooks/profileHooks";
import { IdProp, Post } from "@/types/types";
import { useEffect, useState } from "react";
import PostCard from "../PostCard";
import { Spinner } from "../Loader";

export default function ProfilePosts({id}:IdProp) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
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
        };
        getUserPosts();
    }, [id])

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

    if(loading){
        return <Spinner/>
    }

    if(error){
        return <p className="text-center text-red-500 pt-12">{error}</p>
    }

    return (
        <div className="space-y-4">
            {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post._id} post={post} />)
            ) : (
                <p className="text-center text-slate-500 pt-12">This user has no posts yet.</p>
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