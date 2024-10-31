import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import authMiddleware from './middlewares/authMiddleware';
import journalRoutes from './routes/journalRoutes';

dotenv.config(); // Load environment variables from .env file

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Change this to your frontend's URL if different
  credentials: true, // Allow credentials (e.g., cookies)
};

// Middleware
app.use(cors(corsOptions)); // Use CORS with the specified options
app.use(helmet());
app.use(express.json());

// Initialize DynamoDB client
const dynamoDBClient = new DynamoDBClient({ region: 'us-west-2' }); // Replace 'your-region' with the actual region

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/journals', authMiddleware, journalRoutes);
