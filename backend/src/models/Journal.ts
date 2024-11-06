import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB client and document client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Define the IJournal interface for the structure of journal entries
export interface IJournal {
  userId: string;
  entryId: string;
  date: string;
  opponent: string;
  tournamentName: string;
  location: string;
  courtSurface: string;
  strengths: string;
  weaknesses: string;
  lessonsLearned: string;
}

// Create a new journal entry
export const modelCreateJournalEntry = async (journalEntry: IJournal) => {
  const command = new PutCommand({
    TableName: 'Journal-Entries',
    Item: journalEntry,
  });
  await docClient.send(command);
};

// Get all journal entries for a specific user
export const modelGetJournalEntriesByUserId = async (userId: string) => {
  const command = new QueryCommand({
    TableName: 'Journal-Entries',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  });

  const { Items } = await docClient.send(command);
  return Items as IJournal[];
};

// Get a specific journal entry by ID
export const modelGetJournalEntryById = async (userId: string, entryId: string) => {
  const command = new GetCommand({
    TableName: 'Journal-Entries',
    Key: { userId, entryId },
  });

  const { Item } = await docClient.send(command);
  return Item as IJournal | null;
};

// Update a journal entry by ID
export const modelUpdateJournalEntryById = async (userId: string, entryId: string, updates: Partial<IJournal>) => {
  const command = new UpdateCommand({
    TableName: 'Journal-Entries',
    Key: { userId, entryId },
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

  try {
    const { Attributes } = await docClient.send(command);
    return Attributes as IJournal | null;
  } catch (error) {
    console.error("Error updating journal entry:", error);
    throw error;
  }
};

// Delete a journal entry by ID
export const modelDeleteJournalEntryById = async (userId: string, entryId: string) => {
  const command = new DeleteCommand({
    TableName: 'Journal-Entries',
    Key: { userId, entryId },
  });
  await docClient.send(command);
};
