import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import authMiddleware from './middlewares/authMiddleware';

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

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://Shuhei:4s98QkhAr2IDE54A@tennis-journal.ztmmw.mongodb.net/?retryWrites=true&w=majority&appName=Tennis-Journal'); // Replace with your actual connection string
    console.log('MongoDB connected successfully');
  } catch (error) {
    if (error instanceof Error) {
      console.error('MongoDB connection error:', error.message);
      process.exit(1); // Exit process with failure
    } else {
      console.error('Unexpected error:', error);
      process.exit(1);
    }
  }
};

connectDB();

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