import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define Mongoose User Document Interface
export interface IUserDocument extends Document {
  username: string;
  email: string;
  password: string;
  favorites: mongoose.Types.ObjectId[];
  _id: mongoose.Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define Mongoose Schema
const UserSchema = new Schema<IUserDocument>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FavoriteCity' }],
  },
  { timestamps: true }
);

// Hash Password Before Saving
UserSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare Password for Authentication
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Mongoose Model
export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
