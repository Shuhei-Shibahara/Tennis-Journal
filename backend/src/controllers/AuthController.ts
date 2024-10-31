import { Request, Response } from 'express';
import { createUserInDB, getUsersFromDB } from '../models/User';
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body; // Removed id from body for automatic generation

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { userId: uuidv4(), email, password: hashedPassword }; // Use 'userId' instead of 'id'

    // Ensure the createUserInDB function expects IUser
    await createUserInDB(newUser);

    res.status(201).json({ email });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const users = await getUsersFromDB();
    const user = users?.find((u: any) => u.email === email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate token
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' }); // Use 'userId'

    res.json({ token, user: { userId: user.userId, email: user.email } }); // Use 'userId'
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};
