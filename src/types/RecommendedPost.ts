export interface RecommendedPost {
    id: string;
    description: string;
    imageUrl?: string;
    userId: string; 
    user?: {
        _id: string;
        name: string;
        dp?: string;
    };
    score?: number;
}
