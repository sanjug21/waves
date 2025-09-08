import { Post } from "./PostDetails.type";

export interface IdProp {
    id: string
}
export interface PostPreviewProps {
    post: Post;
    onClose: () => void;
    initialTab?: "likes" | "comments";
}

export interface ImagePreviewProps {
    src: string;
    alt?: string;
    onClose: () => void;
    username?: string;
}