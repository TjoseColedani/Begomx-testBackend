import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, data: { message: 'User not found' } });
            return;
        }
        res.status(200).json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });
        res.status(201).json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const updateData: any = { email };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!user) {
            res.status(404).json({ success: false, data: { message: 'User not found' } });
            return;
        }
        res.status(200).json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, data: { message: 'User not found' } });
            return;
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};
