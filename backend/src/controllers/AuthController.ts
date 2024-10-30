import mongoose from 'mongoose'; // Add this import at the top
import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const newUser = new User({ email, password }); // No manual hashing here
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
    console.log('New user created:', savedUser);
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }

    console.error(error);
    res.status(500).json({ message: 'Error registering user', error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate token
    const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    // Send the token and user info
    res.json({ token, user: { id: user._id } });
  } catch (error) {
    console.error('Error logging in:', error instanceof Error ? error.message : error);
    res.status(500).json({ message: 'Error logging in' });
  }
};