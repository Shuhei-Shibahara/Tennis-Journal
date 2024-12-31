import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import authMiddleware from './middlewares/authMiddleware.js';
import journalRoutes from './routes/journals.js';
import scraperRouter from './routes/scraper.js';
// Load environment variables first
dotenv.config();
const app = express();
// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? 'https://tennis-journal.onrender.com'
        : 'http://localhost:3000',
    credentials: true,
};
// Middleware
app.use(cors(corsOptions));
app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false }));
app.use(express.json());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api', scraperRouter);
// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
export default app;
