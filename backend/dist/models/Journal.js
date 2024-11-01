"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJournalEntryById = exports.updateJournalEntryById = exports.getJournalEntryById = exports.getJournalEntriesByUserId = exports.createJournalEntry = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
// Create a DynamoDB client
const client = new client_dynamodb_1.DynamoDBClient({});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
// Create a new journal entry
const createJournalEntry = (journalEntry) => __awaiter(void 0, void 0, void 0, function* () {
    const command = new lib_dynamodb_1.PutCommand({
        TableName: 'JournalEntries', // Replace with your actual DynamoDB table name
        Item: journalEntry,
    });
    yield docClient.send(command);
});
exports.createJournalEntry = createJournalEntry;
// Get all journal entries for a specific user
const getJournalEntriesByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const command = new lib_dynamodb_1.QueryCommand({
        TableName: 'YourJournalTableName', // Replace with your actual DynamoDB table name
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId,
        },
    });
    const { Items } = yield docClient.send(command);
    return Items; // Return all entries for the user
});
exports.getJournalEntriesByUserId = getJournalEntriesByUserId;
// Get a specific journal entry by ID
const getJournalEntryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const command = new lib_dynamodb_1.GetCommand({
        TableName: 'YourJournalTableName', // Replace with your actual DynamoDB table name
        Key: { id }, // Assuming the partition key is 'id'
    });
    const { Item } = yield docClient.send(command);
    return Item; // Return the entry or null if not found
});
exports.getJournalEntryById = getJournalEntryById;
// Update a journal entry by ID
const updateJournalEntryById = (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
    const command = new lib_dynamodb_1.UpdateCommand({
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
    const { Attributes } = yield docClient.send(command);
    return Attributes; // Return the updated entry
});
exports.updateJournalEntryById = updateJournalEntryById;
// Delete a journal entry by ID
const deleteJournalEntryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const command = new lib_dynamodb_1.DeleteCommand({
        TableName: 'YourJournalTableName', // Replace with your actual DynamoDB table name
        Key: { id },
    });
    yield docClient.send(command);
    return { message: 'Journal entry deleted successfully' }; // Return success message
});
exports.deleteJournalEntryById = deleteJournalEntryById;
