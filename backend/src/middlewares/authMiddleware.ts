import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand, QueryCommand, PutCommand, UpdateCommand, UpdateCommandInput, DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

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

// Function to create a new journal entry in DynamoDB
const createJournalEntry = async (journalData: any) => {
  const params = {
    TableName: 'JournalEntries', // The correct table name
    Item: journalData, // Journal entry data
  };

  try {
    await dynamoDB.send(new PutCommand(params)); // Use the PutCommand to insert new entry
    return journalData; // Return the newly created journal entry
  } catch (error) {
    console.error('Error creating journal entry:', error);
    throw error;
  }
};

// Function to update an existing journal entry in DynamoDB
const updateJournalEntry = async (journalId: string, updatedData: Record<string, any>) => {
  // Prepare the attributes to update dynamically
  const updateExpressionParts: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  // Loop over the fields in updatedData and add to the update expression if they are present
  Object.keys(updatedData).forEach((key) => {
    if (updatedData[key] !== undefined) {
      const attributeName = `#${key}`;
      updateExpressionParts.push(`${attributeName} = :${key}`);
      expressionAttributeNames[attributeName] = key;
      expressionAttributeValues[`:${key}`] = updatedData[key];
    }
  });

  // If no fields to update, return early (to avoid unnecessary database operation)
  if (updateExpressionParts.length === 0) {
    throw new Error('No fields to update');
  }

  // Construct the final update expression
  const updateExpression = 'set ' + updateExpressionParts.join(', ');

  const params: UpdateCommandInput = {
    TableName: 'JournalEntries', // The correct table name
    Key: { id: journalId }, // The partition key of the journal entry
    UpdateExpression: updateExpression, // Dynamically generated update expression
    ExpressionAttributeNames: expressionAttributeNames, // Attribute names
    ExpressionAttributeValues: expressionAttributeValues, // Attribute values
    ReturnValues: 'ALL_NEW', // Correctly set the return values to 'ALL_NEW'
  };

  try {
    const { Attributes } = await dynamoDB.send(new UpdateCommand(params)); // Execute the update command
    if (!Attributes) {
      throw new Error('Journal entry not found');
    }
    return Attributes; // Return the updated journal entry
  } catch (error) {
    console.error('Error updating journal entry:', error);
    throw error; // Handle or rethrow error as needed
  }
};

// Function to delete a journal entry from DynamoDB
const deleteJournalEntry = async (journalId: string) => {
  const params = {
    TableName: 'JournalEntries', // The correct table name
    Key: { journalId }, // The primary key of the journal entry to delete
  };

  try {
    await dynamoDB.send(new DeleteCommand(params)); // Use the DeleteCommand to remove entry
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    throw error;
  }
};

// Middleware to authenticate and fetch user data and journal entries, with CRUD operations
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

    // Handle POST, PUT, DELETE requests for journal entries
    if (req.method === 'POST') {
      // Create new journal entry
      const journalData = req.body; // Assuming journal data is in the request body
      const createdJournal = await createJournalEntry(journalData);
      return res.status(201).json({ message: 'Journal entry created', journal: createdJournal });
    }

    if (req.method === 'PUT') {
      // Update an existing journal entry
      const { journalId } = req.params; // Assuming journalId is passed in params
      const updatedData = req.body; // Get updated journal data from request body
      const updatedJournal = await updateJournalEntry(journalId, updatedData);
      return res.status(200).json({ message: 'Journal entry updated', journal: updatedJournal });
    }

    if (req.method === 'DELETE') {
      // Delete a journal entry
      const { journalId } = req.params; // Assuming journalId is passed in params
      await deleteJournalEntry(journalId);
      return res.status(200).json({ message: 'Journal entry deleted' });
    }

    next(); // Proceed to the next middleware/route if no journal action needed
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Unauthorized' }); // Handle unauthorized errors
  }
};

export default authMiddleware;
