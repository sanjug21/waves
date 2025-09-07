import { dbConnect } from "@/lib/DataBase/dbConnect";
import Follow from "@/lib/models/Follow.model";
import { verifyAccessToken } from "@/utils/auth";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await dbConnect();

    const token = req.cookies.get("accessToken")?.value;
    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decoded = verifyAccessToken(token);
    if (!decoded?.id) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    try {
        const currentUserId = new mongoose.Types.ObjectId(decoded.id);

        const followingDocs = await Follow.find({ follower: currentUserId }).select('following').lean();
        const followingIds = followingDocs.map(doc => doc.following);

        const excludeIds = [...followingIds, currentUserId];

        const suggestions = await Follow.aggregate([
            { $match: { follower: { $in: followingIds } } },
            { $match: { following: { $nin: excludeIds } } },
            {
                $group: {
                    _id: "$following",
                    mutualCount: { $sum: 1 }
                }
            },
            { $sort: { mutualCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    _id: "$user._id",
                    name: "$user.name",
                    dp: "$user.dp",
                    email: "$user.email"
                }
            }
        ]);

        return NextResponse.json(suggestions, { status: 200 });

    } catch (error) {
        console.error("Suggestion API Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}