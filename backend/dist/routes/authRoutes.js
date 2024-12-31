import { Router } from 'express';
import { register, login } from '../controllers/AuthController';
const router = Router();
// Authentication routes
router.post('/register', register); // Register a new user
router.post('/login', login); // Login a user
export default router;
