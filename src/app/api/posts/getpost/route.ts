import Post from "@/lib/models/Post";
import { NextRequest, NextResponse } from "next/server";


export  async function GET(req:NextRequest){
    try {
    
        const posts = await Post.find()
            .populate('userId', 'name dp')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            message: "Posts fetched successfully",
            posts: posts
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


// export async function GET(req: NextRequest) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const page = parseInt(searchParams.get('page') || '1', 10);
//         const limit = parseInt(searchParams.get('limit') || '10', 10);

//         const skip = (page - 1) * limit;

//         const totalPosts = await Post.countDocuments();

//         const posts = await Post.find()
//             .populate('userId', 'name dp')
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(limit);

//         const hasMore = (page * limit) < totalPosts;

//         return NextResponse.json({
//             success: true,
//             message: "Posts fetched successfully",
//             posts: posts,
//             hasMore: hasMore
//         }, { status: 200 });

//     } catch (error: any) {
//         console.error("Error fetching posts:", error);
//         return NextResponse.json({
//             success: false,
//             message: "Error fetching posts",
//             error: error.message
//         }, { status: 500 });
//     }
// }
