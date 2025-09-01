import mongoose, { Document, Schema, Types } from 'mongoose';

export interface Post extends Document {
  userId: Types.ObjectId;
  description?: string;
  imageUrl?: string;
  publicId?: string;
}

const PostSchema: Schema<Post> = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  publicId: {
    type: String,
    trim: true,
  },


}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);