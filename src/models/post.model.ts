import { Timestamp } from "firebase/firestore";


export interface Post{
    postId: string;
    userId: string;
    name:string;
    dp:string;
    description: string;
    postUrl: string;
    likes: string[];
    comments: string[];
    createdAt:string;
    updatedAt?:string;
}

export interface PostState {
    posts: Post[];
    loading: boolean;
    error: string | null;
}