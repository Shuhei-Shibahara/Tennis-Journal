import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/UserController';

const router = Router();

// User routes
router.post('/', createUser); // Create a new user
router.get('/', getUsers); // Get all users
router.get('/:id', getUserById); // Get a user by ID
router.put('/:id', updateUser); // Update a user by ID
router.delete('/:id', deleteUser); // Delete a user by ID

export default router;