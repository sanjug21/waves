
import {Timestamp} from 'firebase/firestore';

export interface Post{
    postId: string;
    userId: string;
    content: string;
    postUrl: string;
    likes: string[];
    comments: string[];
    createdAt: Timestamp;
    updatedAt?: Timestamp;
}

export interface PostState {
    posts: Post[];
    loading: boolean;
    error: string | null;
}