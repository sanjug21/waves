
export interface User{
    uid: string;
    email: string;
    name: string;
    dp: string;
    username: string;
    bio: string;
    online:boolean;
    followers: string[];
    following: string[];
    posts:string[];
    createdAt: string;

}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}