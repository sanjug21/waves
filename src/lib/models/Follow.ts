import mongoose, { Document, Schema, Types } from 'mongoose';

export interface Follow extends Document {
  follower: Types.ObjectId;
  following: Types.ObjectId;
  
}

const followSchema:Schema<Follow> = new mongoose.Schema({
  follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  following: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

},{timestamps:true});

followSchema.index({ follower: 1, following: 1 }, { unique: true }); 

export default mongoose.models.Follow || mongoose.model('Follow', followSchema);