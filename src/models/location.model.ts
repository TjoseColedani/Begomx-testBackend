import mongoose, { Schema } from 'mongoose';
import { ILocation } from '../interfaces/location.interface';

const LocationSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String, required: true },
    place_id: { type: String, required: true, unique: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
}, { timestamps: true });

export const Location = mongoose.model<ILocation>('Location', LocationSchema);
