import mongoose, { Document, Types } from "mongoose";

export interface ProfilePicture extends Document {
    url: string;
    userId: Types.ObjectId;
}

const ProfilePictureSchema = new mongoose.Schema<ProfilePicture>({
    url: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
});

export default  mongoose.models.ProfilePicture || mongoose.model<ProfilePicture>('ProfilePicture', ProfilePictureSchema);
