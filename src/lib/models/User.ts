import bcrypt from 'bcryptjs';
import mongoose, { Document, Schema, Types } from 'mongoose';


export interface User extends Document {
  email: string;
  name: string;
  dp: string;
  bio: string;
  online: boolean;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  posts: Types.ObjectId[];
  password?: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  dp: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 160 },
  online: { type: Boolean, default: false },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  password: { type: String, required: true,select: false},
},{timestamps:true});


UserSchema.pre('save', async function (next) {
  
  if (!this.isModified('password')) {
    return next();
  }
  const passwordToHash = this.password as string; 
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(passwordToHash, salt); 
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false; 
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);