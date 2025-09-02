import { dbConnect } from "@/lib/DataBase/dbConnect";
import User from "@/lib/models/User.model";
import { UpdateProfileSchema } from "@/lib/schema/user.schema";
import { verifyAccessToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function PATCH(req: NextRequest) {
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
        
        const body = await req.json();
        
        
        const parsedData = UpdateProfileSchema.parse(body);
       console.log(parsedData)
        const updatedUser = await User.findByIdAndUpdate(decoded.id, parsedData, {
            new: true,
        });

        return NextResponse.json({
            message: "Profile updated successfully",
            // user: updatedUser,
        });
    } catch (error) {
        
        if (error instanceof ZodError) {
            return NextResponse.json(
                { message: "Validation failed", errors: error.issues },
                { status: 400 }
            );
        }

        console.error("Update Error:", error);
        return NextResponse.json(
            { message: "Failed to update profile details" },
            { status: 500 }
        );
    }
}
