import { Request, Response } from 'express';
import User, { IUser } from '../models/User';

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const newUser: IUser = new User({
      username,
      email,
      password,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// Update a user by ID
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete a user by ID
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};