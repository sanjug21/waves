
import Like from "@/lib/models/Like.model";
import Post from "@/lib/models/Post.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const page = parseInt(body.page || '1', 10);
        const limit = parseInt(body.limit || '10', 10);
        const userId = body.userId?.trim();

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "Bad Request: userId is required"
            }, { status: 400 });
        }

        const skip = (page - 1) * limit;
        const query = { userId };

        const totalPosts = await Post.countDocuments(query);

        const posts = await Post.find(query)
            .populate('userId', 'name dp')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        if (posts.length === 0) {
            return NextResponse.json({
                success: true,
                message: "User posts fetched successfully",
                posts: [],
                hasMore: false
            }, { status: 200 });
        }

        const postIds = posts.map(post => post._id);

        const likesData = await Like.find({ PostId: { $in: postIds } })
            .populate('UserId', 'name dp')
            .lean();

        const likesMap = new Map<string, any[]>();
        likesData.forEach(like => {
            const postIdStr = like.PostId.toString();
            if (!likesMap.has(postIdStr)) {
                likesMap.set(postIdStr, []);
            }
            if (like.UserId) {
                likesMap.get(postIdStr)?.push(like.UserId);
            }
        });

        const postsWithLikes = posts.map(post => ({
            ...post,
            likes: likesMap.get((post as any)._id.toString()) || []
        }));

        const hasMore = (page * limit) < totalPosts;

        return NextResponse.json({
            success: true,
            message: "User posts fetched successfully",
            posts: postsWithLikes,
            hasMore
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({
            success: false,
            message: "Error fetching posts",
            error: error.message
        }, { status: 500 });
    }
}