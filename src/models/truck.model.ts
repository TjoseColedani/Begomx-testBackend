import mongoose, { Schema } from 'mongoose';
import { ITruck } from '../interfaces/truck.interface';

const TruckSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    year: { type: String, required: true },
    color: { type: String, required: true },
    plates: { type: String, required: true, unique: true }
}, { timestamps: true });

export const Truck = mongoose.model<ITruck>('Truck', TruckSchema);
