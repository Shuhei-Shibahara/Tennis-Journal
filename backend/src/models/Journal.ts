import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

// Create a DynamoDB client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Define the journal entry structure
export interface IJournal {
  userId: string; // Assuming userId is a string for DynamoDB
  date: Date;
  opponent: string;
  tournamentName: string;
  location: string;
  courtSurface: string;
  strengths: string;
  weaknesses: string;
  lessonsLearned: string;
}

// Create a new journal entry
export const createJournalEntry = async (journalEntry: IJournal) => {
  const command = new PutCommand({
    TableName: 'JournalEntries', // Replace with your actual DynamoDB table name
    Item: journalEntry,
  });
  await docClient.send(command);
};

// Get all journal entries for a specific user
export const getJournalEntriesByUserId = async (userId: string) => {
  const command = new QueryCommand({
    TableName: 'YourJournalTableName', // Replace with your actual DynamoDB table name
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  });
  const { Items } = await docClient.send(command);
  return Items as IJournal[]; // Return all entries for the user
};

// Get a specific journal entry by ID
export const getJournalEntryById = async (id: string) => {
  const command = new GetCommand({
    TableName: 'YourJournalTableName', // Replace with your actual DynamoDB table name
    Key: { id }, // Assuming the partition key is 'id'
  });
  const { Item } = await docClient.send(command);
  return Item as IJournal | null; // Return the entry or null if not found
};

// Update a journal entry by ID
export const updateJournalEntryById = async (id: string, updates: Partial<IJournal>) => {
  const command = new UpdateCommand({
    TableName: 'YourJournalTableName', // Replace with your actual DynamoDB table name
    Key: { id },
    UpdateExpression: 'set #date = :date, #opponent = :opponent, #tournamentName = :tournamentName, #location = :location, #courtSurface = :courtSurface, #strengths = :strengths, #weaknesses = :weaknesses, #lessonsLearned = :lessonsLearned',
    ExpressionAttributeNames: {
      '#date': 'date',
      '#opponent': 'opponent',
      '#tournamentName': 'tournamentName',
      '#location': 'location',
      '#courtSurface': 'courtSurface',
      '#strengths': 'strengths',
      '#weaknesses': 'weaknesses',
      '#lessonsLearned': 'lessonsLearned',
    },
    ExpressionAttributeValues: {
      ':date': updates.date,
      ':opponent': updates.opponent,
      ':tournamentName': updates.tournamentName,
      ':location': updates.location,
      ':courtSurface': updates.courtSurface,
      ':strengths': updates.strengths,
      ':weaknesses': updates.weaknesses,
      ':lessonsLearned': updates.lessonsLearned,
    },
    ReturnValues: 'ALL_NEW',
  });
  const { Attributes } = await docClient.send(command);
  return Attributes as IJournal | null; // Return the updated entry
};

// Delete a journal entry by ID
export const deleteJournalEntryById = async (id: string) => {
  const command = new DeleteCommand({
    TableName: 'YourJournalTableName', // Replace with your actual DynamoDB table name
    Key: { id },
  });
  await docClient.send(command);
  return { message: 'Journal entry deleted successfully' }; // Return success message
};
