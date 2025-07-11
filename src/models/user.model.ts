import { Timestamp } from "firebase/firestore";

export interface User{
    uid: string;
    email: string;
    name: string;
    dp: string;
    username: string;
    bio: string;
    followers: string[];
    following: string[];
    createdAt: Timestamp;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}