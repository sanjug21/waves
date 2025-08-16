import { NextRequest } from "next/server";


export async function GET(req:NextRequest){
    const {searchParams}=req.nextUrl;
    const userId = searchParams.get('id');
    if(!userId){
        return new Response("User ID is required", { status: 400 });
    }
    try{

    }
    catch(err){

    }
}