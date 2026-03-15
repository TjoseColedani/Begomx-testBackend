import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>('User', UserSchema);
