import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User'; 

interface AuthRequest extends Request {
  user?: any; 
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Authorization denied, no token' });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById((decoded as any).id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    req.user = user;

    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Authorization denied, token invalid' });
  }
};

export default authMiddleware;