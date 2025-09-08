export interface Post {
    _id: string;
    userId: {
        _id: string;
        name: string;
        dp: string;
    };
    description?: string;
    imageUrl?: string;
    publicId?: string;
  likes: {
    _id: string;
    name: string;
    dp: string;
  }[];
  comments: {
    _id: string;
    name: string;
    dp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}