import { Request, Response } from 'express';
import { Order } from '../models/order.model';
import { Truck } from '../models/truck.model';
import { Location } from '../models/location.model';

export const getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await Order.find()
            .populate('truck')
            .populate('pickup')
            .populate('dropoff')
            .populate('user', 'email');
        
        res.status(200).json({ success: true, data: orders });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('truck')
            .populate('pickup')
            .populate('dropoff')
            .populate('user', 'email');
            
        if (!order) {
            res.status(404).json({ success: false, data: { message: 'Order not found' } });
            return;
        }
        res.status(200).json({ success: true, data: order });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const getOrderStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedStats = stats.reduce((acc: any, curr: any) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        res.status(200).json({ success: true, data: formattedStats });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const getOrderDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderDetails = await Order.aggregate([
            {
                $lookup: {
                    from: 'trucks',
                    localField: 'truck',
                    foreignField: '_id',
                    as: 'truckData'
                }
            },
            { $unwind: { path: '$truckData', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'pickup',
                    foreignField: '_id',
                    as: 'pickupData'
                }
            },
            { $unwind: { path: '$pickupData', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'dropoff',
                    foreignField: '_id',
                    as: 'dropoffData'
                }
            },
            { $unwind: { path: '$dropoffData', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    'userData.password': 0
                }
            }
        ]);
        
        res.status(200).json({ success: true, data: orderDetails });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const createOrder = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const { truck, pickup, dropoff } = req.body;
        
        const truckExists = await Truck.findById(truck);
        const pickupExists = await Location.findById(pickup);
        const dropoffExists = await Location.findById(dropoff);
        
        if (!truckExists || !pickupExists || !dropoffExists) {
            res.status(400).json({ success: false, data: { message: 'Invalid truck, pickup, or dropoff ID' } });
            return;
        }

        const order = await Order.create({ user: userId, truck, pickup, dropoff });
        res.status(201).json({ success: true, data: order });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
         const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
         if (!order) {
            res.status(404).json({ success: false, data: { message: 'Order not found' } });
            return;
         }
         res.status(200).json({ success: true, data: order });
    } catch (error: any) {
         res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
        
        if (!order) {
            res.status(404).json({ success: false, data: { message: 'Order not found' } });
            return;
        }
        res.status(200).json({ success: true, data: order });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            res.status(404).json({ success: false, data: { message: 'Order not found' } });
            return;
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};
