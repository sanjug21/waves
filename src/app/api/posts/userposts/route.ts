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
            .limit(limit);

        const hasMore = (page * limit) < totalPosts;

        return NextResponse.json({
            success: true,
            message: "User posts fetched successfully",
            posts,
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
