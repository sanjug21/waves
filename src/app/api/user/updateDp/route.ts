
import { dbConnect } from "@/lib/dbConnect";
import User from "@/lib/models/User";
import { uploadImage } from "@/utils/post"; 
import { verifyAccessToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";
import ProfilePicture from "@/lib/models/ProfilePicture";
import { de } from "zod/v4/locales";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const token = req.cookies.get("accessToken")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded = verifyAccessToken(token);
        if (!decoded?.id) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const formData = await req.formData();
        const imageFile = formData.get("image") as File | null;

        if (!imageFile) {
            return NextResponse.json({ message: "No image file provided." }, { status: 400 });
        }

        const uploadResult = await uploadImage(imageFile, "ProfilePics");

        const updatedUser = await User.findByIdAndUpdate(
            decoded.id,
            { dp: uploadResult.secure_url },
            { new: true }
        );
        await ProfilePicture.create({
            url: uploadResult.secure_url,
            userId: decoded.id
        });



        return NextResponse.json({
            message: "Profile picture updated successfully.",
            dp: updatedUser.dp,
        }, { status: 200 });

    } catch (error) {
        console.error("DP Update Error:", error);
        return NextResponse.json({ message: "Failed to update profile picture." }, { status: 500 });
    }
}
