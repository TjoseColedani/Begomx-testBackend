import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ success: false, data: { message: 'Email already exists' } });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({
            email,
            password: hashedPassword
        });

        res.status(201).json({ success: true, data: { _id: user._id, email: user.email } });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email }).select('+password');
        if (!user || !user.password) {
            res.status(401).json({ success: false, data: { message: 'Invalid credentials' } });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ success: false, data: { message: 'Invalid credentials' } });
            return;
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
            expiresIn: '1d'
        });

        res.status(200).json({ success: true, data: { token, user: { _id: user._id, email: user.email } } });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};
