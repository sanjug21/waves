import mongoose, { Document, Schema } from "mongoose";

export enum MessageEnum {
    TEXT = "text",
    IMAGE = "image",
    VIDEO = "video",
    FILE = "file"
}

export interface Message extends Document {
    conversationId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    content: string;
    type: MessageEnum;
    isEdited: boolean;
    isDeleted: boolean;
    seenBy: mongoose.Types.ObjectId[]; 
}

const MessageSchema = new Schema<Message>(
    {
        conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
        senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        type: { type: String, enum: Object.values(MessageEnum), default: MessageEnum.TEXT },
        isEdited: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        seenBy: [{ type: Schema.Types.ObjectId, ref: "User" }]
    },
    { timestamps: true }
);

MessageSchema.index({ conversationId: 1, createdAt: -1 });

export const Message = mongoose.model<Message>("Message", MessageSchema);
