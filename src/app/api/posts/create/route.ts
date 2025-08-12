import { dbConnect } from "@/lib/dbConnect";
import Post from "@/lib/models/Post";
import User from "@/lib/models/User";
import { PostSchema } from "@/lib/schema/post.schema";
import { uploadImage } from "@/utils/post";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { verifyAccessToken } from "@/utils/auth";

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ message: "Authentication token not found." }, { status: 401 });
    }

    const decodedPayload = verifyAccessToken(accessToken);
    if (!decodedPayload) {
      return NextResponse.json({ message: "Invalid or expired access token." }, { status: 401 });
    }

    const userId = decodedPayload.id;
    await dbConnect();

    const formData = await req.formData();
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File | null;

    let imageUrl = '';
    let publicId = '';

    if (imageFile) {
      const uploadResult = await uploadImage(imageFile, "Posts");
      imageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    }

    const postData = {
      userId,
      description,
      imageUrl,
      publicId,
    };

    const parsedData = PostSchema.parse(postData);

    const post = await Post.create(parsedData);
    await User.findByIdAndUpdate(userId, {
      $push: { posts: post._id }
    });

    return NextResponse.json({
      message: "Post created successfully.",
      post
    }, { status: 201 });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: "Validation failed.", errors: error.issues }, { status: 400 });
    }
    console.error('API Error:', error);
    return NextResponse.json({ message: "Failed to create post. Please try again." }, { status: 500 });
  }
}