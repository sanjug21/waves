import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/DataBase/dbConnect";
import Post from "@/lib/models/Post.model";
import Like from "@/lib/models/Like.model";
import Follow from "@/lib/models/Follow.model";
import { verifyAccessToken } from "@/utils/auth";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("accessToken")?.value;
        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const decodedPayload = verifyAccessToken(token);
        if (!decodedPayload) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }

        await dbConnect();
        const currentUserId = decodedPayload.id;

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = 15;
        const skip = (page - 1) * limit;

        // Get followed user IDs
        const follows = await Follow.find({ follower: currentUserId }).select("following").lean();
        const followedUserIds = follows.map((f: any) => f.following);

        // Unified feed: posts from followed + others, sorted by latest
        const posts = await Post.find({
            $or: [{ userId: { $in: followedUserIds } }, { userId: { $nin: followedUserIds } }],
        })
            .populate("userId", "name dp")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        if (posts.length === 0) {
            return NextResponse.json({ success: true, posts: [], page });
        }

        // Attach likes
        const postIds = posts.map((p: any) => p._id);
        const likesData = await Like.find({ PostId: { $in: postIds } })
            .populate("UserId", "name dp")
            .lean();

        const likesMap = new Map<string, any[]>();
        likesData.forEach((like: any) => {
            const postIdStr = like.PostId.toString();
            if (!likesMap.has(postIdStr)) likesMap.set(postIdStr, []);
            if (like.UserId) likesMap.get(postIdStr)!.push(like.UserId);
        });

        const postsWithLikes = posts.map((post: any) => ({
            ...post,
            likes: likesMap.get(post._id.toString()) || [],
        }));

        return NextResponse.json({
            success: true,
            posts: postsWithLikes,
            page,
        });
    } catch (error: any) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
