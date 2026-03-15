import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/users.routes';
import truckRoutes from './routes/trucks.routes';
import locationRoutes from './routes/locations.routes';
import orderRoutes from './routes/orders.routes';
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/trucks', truckRoutes);
app.use('/locations', locationRoutes);
app.use('/orders', orderRoutes);

app.get('/health', (req: Request, res: Response) => {
    res.json({ success: true, message: 'Server is running' });
});

app.use(errorHandler);

export default app;
