import Like from "@/lib/models/Like.model";
import Post from "@/lib/models/Post.model";
import { NextRequest, NextResponse } from "next/server";


export  async function GET(req:NextRequest){
    try {
    
        const posts = await Post.find()
            .populate('userId', 'name dp')
            .sort({ createdAt: -1 })
            .lean();

        if (posts.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No posts found",
                posts: []
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
            likes: likesMap.get((post as any)._id.toString()) || [],
        }));

        return NextResponse.json({
            success: true,
            message: "Posts fetched successfully",
            posts: postsWithLikes
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
