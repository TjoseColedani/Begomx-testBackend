import mongoose, { Schema } from 'mongoose';
import { IOrder } from '../interfaces/order.interface';

const OrderSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    truck: { type: Schema.Types.ObjectId, ref: 'Truck', required: true },
    status: { 
        type: String, 
        enum: ['created', 'in_transit', 'completed'], 
        default: 'created' 
    },
    pickup: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    dropoff: { type: Schema.Types.ObjectId, ref: 'Location', required: true }
}, { timestamps: true });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
