import Post from "@/lib/models/Post";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "Bad Request: userId is required"
            }, { status: 400 });
        }

        const skip = (page - 1) * limit;
        const query = { userId: userId };

        const totalPosts = await Post.countDocuments(query);

        const posts = await Post.find(query)
            .populate('userId', 'name dp')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const hasMore = (page * limit) < totalPosts;

        return NextResponse.json({
            success: true,
            message: "User posts fetched successfully",
            posts: posts,
            hasMore: hasMore
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