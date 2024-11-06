import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand, QueryCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

interface AuthRequest extends Request {
  user?: any; // Define a better type based on your user structure
  journals?: any[]; // Attach journals array to the request if needed
}

// Initialize DynamoDB client
const dynamoDBClient = new DynamoDBClient({ region: 'us-west-2' });
const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient); // Create a document client

// Function to get user data from DynamoDB
const getUserData = async (userId: string) => {
  const params = {
    TableName: 'Users', // Assuming this is your Users table
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

// Function to get journal entries for a user from DynamoDB
const getUserJournals = async (userId: string) => {
  const params = {
    TableName: 'JournalEntries', // The correct table name
    KeyConditionExpression: 'userId = :userId', // Query using the partition key (userId)
    ExpressionAttributeValues: {
      ':userId': userId, // The userId to filter by
    },
  };

  try {
    const data = await dynamoDB.send(new QueryCommand(params)); // Use the QueryCommand
    return data.Items; // Return the journal entries
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    throw error; // Handle or rethrow error as needed
  }
};

// Middleware to authenticate and fetch user data and journal entries
const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' }); // Return error if no token
  }

  try {
    // Ensure JWT_SECRET is defined
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT secret is not defined'); // Throw error if secret is not set
    }

    // Decode the token to get the userId
    const decoded: any = jwt.verify(token, secret); // Use the defined secret
    const userId = decoded.userId; // Assuming the token contains userId

    console.log('Decoded user ID:', userId);

    // Fetch user data from DynamoDB
    const userData = await getUserData(userId);
    if (!userData) {
      return res.status(404).json({ message: 'User not found' }); // Return error if user not found
    }

    // Fetch user's journal entries from DynamoDB
    const journals = await getUserJournals(userId);
    if (!journals || journals.length === 0) {
      return res.status(404).json({ message: 'No journal entries found' }); // Return error if no journal entries found
    }

    // Attach user data and journals to the request object
    req.user = userData; // Attach user data to request
    req.journals = journals; // Attach journal entries to request

    next(); // Proceed to the next middleware/route
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Unauthorized' }); // Handle unauthorized errors
  }
};

export default authMiddleware;
