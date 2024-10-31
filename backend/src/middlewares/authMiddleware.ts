import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

interface AuthRequest extends Request {
  user?: any; // Define a better type based on your user structure
}

// Initialize DynamoDB client
const dynamoDBClient = new DynamoDBClient({ region: 'us-west-2' });
const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient); // Create a document client

// Function to get user data from DynamoDB
const getUserData = async (userId: string) => {
  const params = {
    TableName: 'Users',
    Key: {
      userId: userId, // Correctly using the partition key
    },
  };

  try {
    const data = await dynamoDB.send(new GetCommand(params)); // Use the GetCommand
    return data.Item; // Return the user data
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error; // Handle or rethrow error as needed
  }
};

// Middleware to authenticate and fetch user data
const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Ensure JWT_SECRET is defined
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT secret is not defined'); // Throw error if secret is not set
    }

    // Decode the token
    const decoded: any = jwt.verify(token, secret); // Use the defined secret
    const userId = decoded.userId; // Ensure this matches your token payload

    console.log('Decoded user ID:', userId);

    // Fetch user data
    const userData = await getUserData(userId);
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = userData; // Attach user data to request
    next(); // Proceed to the next middleware/route
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default authMiddleware;
