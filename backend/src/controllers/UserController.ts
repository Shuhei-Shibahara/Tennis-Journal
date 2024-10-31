import { Request, Response } from 'express';
import {
  createUserInDB,
  getUsersFromDB,
  getUserByIdFromDB,
  updateUserInDB,
  deleteUserFromDB,
} from '../models/User';

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { userId, email, password } = req.body; // Adjusted to include userId
    const newUser = { userId, email, password }; // Creating a new user object

    await createUserInDB(newUser);
    res.status(201).json(newUser); // Respond with the created user data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsersFromDB();
    res.status(200).json(users); // Respond with the list of users
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id; // Using userId from route parameters
    const user = await getUserByIdFromDB(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user); // Respond with the found user
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// Update a user by ID
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id; // Using userId from route parameters
    const updatedUser = await updateUserInDB(userId, req.body); // Pass the request body for updates

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser); // Respond with the updated user
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete a user by ID
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id; // Using userId from route parameters
    await deleteUserFromDB(userId); // Call the delete function

    res.status(200).json({ message: 'User deleted successfully' }); // Respond with success message
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user', error });
  }
};
