import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/DataBase/dbConnect";
import PostModel from "@/lib/models/Post.model";
import Follow from "@/lib/models/Follow.model";
import Like from "@/lib/models/Like.model";
import { Recommender } from "@/lib/reommender/recommender";
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

        // Follow graph
        const follows = await Follow.find({ follower: currentUserId }).select("following").lean();
        const followedUserIds = follows.map((f: any) => String(f.following));

        // Likes
        const likedDocs = await Like.find({ UserId: currentUserId }).select("PostId").lean();
        const likedPostIds = likedDocs.map((like: any) => String(like.PostId));

        // All posts with user info populated
        const dbPosts = await PostModel.find({}).populate("userId", "name dp").lean();

        const posts = dbPosts.map((doc: any) => ({
            id: String(doc._id),
            description: doc.description || "",
            imageUrl: doc.imageUrl || "",
            userId: doc.userId ? String(doc.userId._id) : "", // always string
            user: doc.userId
                ? { _id: String(doc.userId._id), name: doc.userId.name, dp: doc.userId.dp || "" }
                : undefined,
        }));

        // Fallback description if missing
        const enrichDescription = (post: any) =>
            post.description && post.description.trim().length > 0
                ? post.description
                : post.imageUrl
                    ? `Image-based post: ${post.imageUrl.split("/").pop()}`
                    : "Untitled";

        // Generate embeddings
        const postsWithEmbeddings = await Promise.all(
            posts.map(async (post) => ({
                ...post,
                embedding: await Recommender.getEmbedding(enrichDescription(post)),
            }))
        );

        const likedPosts = postsWithEmbeddings.filter((p) => likedPostIds.includes(p.id));

        // Fallback: if no liked posts, return random posts
        if (likedPosts.length === 0) {
            const shuffled = posts.sort(() => 0.5 - Math.random());
            return NextResponse.json(shuffled.slice(0, 10));
        }

        // Build user vector
        const dimensions = likedPosts[0].embedding.length;
        const userVector = new Float32Array(dimensions).fill(0);
        for (const post of likedPosts) {
            for (let i = 0; i < dimensions; i++) userVector[i] += post.embedding[i];
        }
        for (let i = 0; i < dimensions; i++) userVector[i] /= likedPosts.length;

        // Score candidates
        const candidateScores = postsWithEmbeddings
            .filter((p) => !likedPostIds.includes(p.id) && p.userId !== currentUserId)
            .map((p) => ({
                id: p.id,
                description: enrichDescription(p),
                imageUrl: p.imageUrl,
                userId: p.userId,
                user: p.user,
                score: Recommender.cosineSimilarity(userVector, p.embedding),
            }));

        const followedCandidates = candidateScores
            .filter((c) => followedUserIds.includes(c.userId))
            .sort((a, b) => b.score - a.score);

        const globalCandidates = candidateScores
            .filter((c) => !followedUserIds.includes(c.userId))
            .sort((a, b) => b.score - a.score);

        const top = 10;
        const recommendations = [
            ...followedCandidates.slice(0, top),
            ...globalCandidates.slice(0, Math.max(0, top - followedCandidates.length)),
        ].slice(0, top);

        return NextResponse.json(recommendations);
    } catch (error) {
        console.error("Recommendation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
