import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/DataBase/dbConnect";
import PostModel from "@/lib/models/Post.model";
import Like from "@/lib/models/Like.model";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const { id } = params;

        const post = await PostModel.findById(id)
            .populate("userId", "name dp")
            .lean();

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Attach likes
        const likes = await Like.find({ PostId: id }).populate("UserId", "name dp").lean();
        const likesList = likes.map((like: any) => ({
            _id: String(like.UserId._id),
            name: like.UserId.name,
            dp: like.UserId.dp || "",
        }));

        // Comments not implemented yet, return empty array
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
