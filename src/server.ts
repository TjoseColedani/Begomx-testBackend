import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/database';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    // Check required env vars
    if (!process.env.MONGO_URI || !process.env.JWT_SECRET || !process.env.PORT) {
        console.error('FATAL ERROR: Missing environment variables.');
        process.exit(1);
    }

    try {
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
