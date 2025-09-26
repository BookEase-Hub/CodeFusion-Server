import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // This should be hashed
    email: { type: String, required: true, unique: true },
    githubId: { type: String, sparse: true, unique: true },
  },
  { timestamps: true }
);

export const User = model('User', UserSchema);