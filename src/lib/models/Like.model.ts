import mongoose, { Document, Schema, Types } from "mongoose";

export interface Like extends Document {
    PostId: Types.ObjectId;
    UserId: Types.ObjectId;
}

const LikeSchema: Schema<Like> = new mongoose.Schema(
    {
        PostId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
        UserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

LikeSchema.index({ PostId: 1, UserId: 1 }, { unique: true });

export default mongoose.models.Like || mongoose.model<Like>("Like", LikeSchema);