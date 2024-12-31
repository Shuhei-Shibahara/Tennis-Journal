import { DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDBClient } from '../config/db.js';
// Create document client from the initialized DynamoDB client
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);
// Create a new journal entry
export const modelCreateJournalEntry = async (journalEntry) => {
    try {
        console.log('Creating journal entry:', {
            tableName: 'Journal-Entries',
            userId: journalEntry.userId,
            entryId: journalEntry.entryId
        });
        const command = new PutCommand({
            TableName: 'Journal-Entries',
            Item: journalEntry,
        });
        const result = await docClient.send(command);
        console.log('Create result:', result);
        return result;
    }
    catch (error) {
        console.error('Create error details:', {
            tableName: 'Journal-Entries',
            journalEntry,
            error
        });
        throw error;
    }
};
// Get all journal entries for a specific user
export const modelGetJournalEntriesByUserId = async (userId) => {
    try {
        const command = new QueryCommand({
            TableName: 'Journal-Entries',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId,
            },
        });
        const { Items } = await docClient.send(command);
        return Items;
    }
    catch (error) {
        console.error('Error fetching journal entries:', error);
        throw error;
    }
};
// Get a specific journal entry by ID
export const modelGetJournalEntryById = async (userId, entryId) => {
    try {
        console.log('Getting journal entry:', { userId, entryId });
        const command = new GetCommand({
            TableName: 'Journal-Entries',
            Key: { userId, entryId },
        });
        const { Item } = await docClient.send(command);
        console.log('Found item:', Item);
        return Item;
    }
    catch (error) {
        console.error('Error getting journal entry:', error);
        throw error;
    }
};
// Update a journal entry by ID
export const modelUpdateJournalEntryById = async (userId, entryId, updates) => {
    const command = new UpdateCommand({
        TableName: 'Journal-Entries',
        Key: { userId, entryId },
        UpdateExpression: `set 
      #date = :date,
      #opponent = :opponent,
      #tournamentName = :tournamentName,
      #location = :location,
      #courtSurface = :courtSurface,
      #strengths = :strengths,
      #weaknesses = :weaknesses,
      #lessonsLearned = :lessonsLearned,
      #result = :result,
      #score = :score,
      #stats = :stats`,
        ExpressionAttributeNames: {
            '#date': 'date',
            '#opponent': 'opponent',
            '#tournamentName': 'tournamentName',
            '#location': 'location',
            '#courtSurface': 'courtSurface',
            '#strengths': 'strengths',
            '#weaknesses': 'weaknesses',
            '#lessonsLearned': 'lessonsLearned',
            '#result': 'result',
            '#score': 'score',
            '#stats': 'stats',
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
            ':result': updates.result,
            ':score': updates.score,
            ':stats': updates.stats,
        },
        ReturnValues: 'ALL_NEW',
    });
    try {
        const { Attributes } = await docClient.send(command);
        return Attributes;
    }
    catch (error) {
        console.error("Error updating journal entry:", error);
        throw error;
    }
};
// Delete a journal entry by ID
export const modelDeleteJournalEntryById = async (userId, entryId) => {
    try {
        if (!userId || !entryId) {
            throw new Error(`Missing required parameters: userId=${userId}, entryId=${entryId}`);
        }
        // First verify the entry exists
        const getCommand = new GetCommand({
            TableName: 'Journal-Entries',
            Key: {
                userId: userId,
                entryId: entryId
            }
        });
        const { Item } = await docClient.send(getCommand);
        if (!Item) {
            throw new Error(`Entry not found: userId=${userId}, entryId=${entryId}`);
        }
        const deleteCommand = new DeleteCommand({
            TableName: 'Journal-Entries',
            Key: {
                userId: userId,
                entryId: entryId
            }
        });
        await docClient.send(deleteCommand);
        return true;
    }
    catch (error) {
        console.error('Delete operation failed:', {
            operation: 'delete',
            userId,
            entryId,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
    }
};
export const testDynamoDBOperations = async (userId, entryId) => {
    try {
        // Test Get
        console.log('Testing Get...');
        const getCommand = new GetCommand({
            TableName: 'Journal-Entries',
            Key: { userId, entryId }
        });
        const getResult = await docClient.send(getCommand);
        console.log('Get Result:', getResult);
        // Test Delete
        console.log('Testing Delete...');
        const deleteCommand = new DeleteCommand({
            TableName: 'Journal-Entries',
            Key: { userId, entryId }
        });
        const deleteResult = await docClient.send(deleteCommand);
        console.log('Delete Result:', deleteResult);
        return true;
    }
    catch (error) {
        console.error('Test failed:', error);
        throw error;
    }
};
export const testTableStructure = async () => {
    try {
        const describeCommand = new DescribeTableCommand({
            TableName: 'Journal-Entries'
        });
        const result = await dynamoDBClient.send(describeCommand);
        if (result.Table) {
            console.log('Table structure:', JSON.stringify(result.Table, null, 2));
            return result.Table;
        }
        throw new Error('Table not found');
    }
    catch (error) {
        console.error('Error describing table:', error);
        throw error;
    }
};
