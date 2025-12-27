import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/DataBase/dbConnect";
import PostModel from "@/lib/models/Post.model";
import Like from "@/lib/models/Like.model";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        // Extract id from the request body
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Post ID is required in body" }, { status: 400 });
        }

        const post = await PostModel.findById(id)
            .populate("userId", "name dp")
            .lean();

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Attach likes
        const likes = await Like.find({ PostId: id }).populate("UserId", "name dp").lean();
        const likesList = likes.map((like: any) => ({
            _id: String(like.UserId?._id || ""),
            name: like.UserId?.name || "Unknown",
            dp: like.UserId?.dp || "",
        }));

        const postWithExtras = {
            ...post,
            likes: likesList,
            comments: [],
        };

        return NextResponse.json({ post: postWithExtras });
    } catch (error: any) {
        console.error("Error fetching post:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}