import { UserDetails } from "./UserDetails.type";

export interface ChatMessage {
    _id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    message?: string;
    image?: string;
    video?: string;
    file?: string;
    audio?: string;
    isEdited: boolean;
    isDeleted: boolean;
    isSeen: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SendMessagePayload {
    senderId: string;
    receiverId: string;
    message?: string;
    image?: string;
    video?: string;
    audio?: string;
    file?: string;
}


export interface ConversationDetails {
    _id: string;
    senderId: string;
    receiverId: UserDetails;
    lastMessage: string;
    lastMessageSeen: boolean;
    updatedAt: string;
    createdAt: string;

}