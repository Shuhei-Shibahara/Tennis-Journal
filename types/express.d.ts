declare namespace Express {
  export interface Request {
    user?: {
      userId: string;
      // Add any other user properties you need
    };
  }
} 