import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import authMiddleware from './middlewares/authMiddleware';
import journalRoutes from './routes/journalRoutes';
import scraperRouter from './routes/scraper';

dotenv.config(); // Load environment variables

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

// Initialize DynamoDB client
export const dynamoDBClient = new DynamoDBClient({ region: 'us-west-2' });

// Define a simple route
app.get('/', (req, res) => {
  return res.send('Hello World!');
});

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
