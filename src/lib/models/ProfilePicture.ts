import mongoose, { Document, Schema, Types } from "mongoose";

export interface ProfilePicture extends Document {
    url: string;
    userId: Types.ObjectId;
}

const ProfilePictureSchema: Schema<ProfilePicture> = new Schema<ProfilePicture>({
    url: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" }
});

export default  mongoose.models.ProfilePicture || mongoose.model<ProfilePicture>('ProfilePicture', ProfilePictureSchema);
