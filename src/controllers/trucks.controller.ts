import { Request, Response } from 'express';
import { Truck } from '../models/truck.model';

export const getTrucks = async (req: Request, res: Response): Promise<void> => {
    try {
        const trucks = await Truck.find();
        res.status(200).json({ success: true, data: trucks });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const getTruckById = async (req: Request, res: Response): Promise<void> => {
    try {
        const truck = await Truck.findById(req.params.id);
        if (!truck) {
            res.status(404).json({ success: false, data: { message: 'Truck not found' } });
            return;
        }
        res.status(200).json({ success: true, data: truck });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const createTruck = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const truck = await Truck.create({ ...req.body, user: userId });
        res.status(201).json({ success: true, data: truck });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const updateTruck = async (req: Request, res: Response): Promise<void> => {
    try {
        const truck = await Truck.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!truck) {
            res.status(404).json({ success: false, data: { message: 'Truck not found' } });
            return;
        }
        res.status(200).json({ success: true, data: truck });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const deleteTruck = async (req: Request, res: Response): Promise<void> => {
    try {
        const truck = await Truck.findByIdAndDelete(req.params.id);
        if (!truck) {
            res.status(404).json({ success: false, data: { message: 'Truck not found' } });
            return;
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};
