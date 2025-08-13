import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/User";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
    
    try {
        await dbConnect();
        
        const url = new URL(req.url);
        
        const searchQuery = url.searchParams.get('query');

        if (!searchQuery) {
            return NextResponse.json({ success: true, users: [] }, { status: 200 });
        }

        const caseInsensitiveQuery = new RegExp(searchQuery, 'i');
        
        

        const users = await User.find({
            $or: [
                { name: caseInsensitiveQuery },
                { email: caseInsensitiveQuery }
            ]
        }).select('_id name dp email bio');

        return NextResponse.json({
            success: true,
            users: users
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error searching users:", error);
        return NextResponse.json({
            success: false,
            message: "Error searching users",
            error: error.message
        }, { status: 500 });
    }
}