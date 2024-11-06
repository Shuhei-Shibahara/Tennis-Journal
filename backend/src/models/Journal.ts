import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export interface IJournal {
  userId: string;
  id: string;
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
    TableName: 'JournalEntries',
    Item: journalEntry,
  });
  await docClient.send(command);
};

// Get all journal entries for a specific user
export const modelGetJournalEntriesByUserId = async (userId: string) => {
  const command = new QueryCommand({
    TableName: 'JournalEntries',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  });
  const { Items } = await docClient.send(command);
  return Items as IJournal[];
};

// Get a specific journal entry by ID
export const modelGetJournalEntryById = async (userId: string, id: string) => {
  const command = new GetCommand({
    TableName: 'JournalEntries',
    Key: { userId, id },
  });
  const { Item } = await docClient.send(command);
  return Item as IJournal | null;
};

// Update a journal entry by ID
export const modelUpdateJournalEntryById = async (userId: string, id: string, updates: Partial<IJournal>) => {
  const command = new UpdateCommand({
    TableName: 'JournalEntries',
    Key: { userId, id },
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
  return Attributes as IJournal | null;
};

// Delete a journal entry by ID
export const modelDeleteJournalEntryById = async (userId: string, id: string) => {
  const command = new DeleteCommand({
    TableName: 'JournalEntries',
    Key: { userId, id },
  });
  await docClient.send(command);
};
