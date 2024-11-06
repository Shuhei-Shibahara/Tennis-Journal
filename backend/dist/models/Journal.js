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
exports.modelDeleteJournalEntryById = exports.modelUpdateJournalEntryById = exports.modelGetJournalEntryById = exports.modelGetJournalEntriesByUserId = exports.modelCreateJournalEntry = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client = new client_dynamodb_1.DynamoDBClient({});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
// Create a new journal entry
const modelCreateJournalEntry = (journalEntry) => __awaiter(void 0, void 0, void 0, function* () {
    const command = new lib_dynamodb_1.PutCommand({
        TableName: 'Journal-Entries',
        Item: journalEntry,
    });
    yield docClient.send(command);
});
exports.modelCreateJournalEntry = modelCreateJournalEntry;
// Get all journal entries for a specific user
const modelGetJournalEntriesByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const command = new lib_dynamodb_1.QueryCommand({
        TableName: 'Journal-Entries',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId,
        },
    });
    const { Items } = yield docClient.send(command);
    return Items;
});
exports.modelGetJournalEntriesByUserId = modelGetJournalEntriesByUserId;
// Get a specific journal entry by ID
const modelGetJournalEntryById = (userId, id) => __awaiter(void 0, void 0, void 0, function* () {
    const command = new lib_dynamodb_1.GetCommand({
        TableName: 'Journal-Entries',
        Key: { userId, id },
    });
    const { Item } = yield docClient.send(command);
    return Item;
});
exports.modelGetJournalEntryById = modelGetJournalEntryById;
// Update a journal entry by ID
const modelUpdateJournalEntryById = (userId, id, updates) => __awaiter(void 0, void 0, void 0, function* () {
    const command = new lib_dynamodb_1.UpdateCommand({
        TableName: 'Journal-Entries',
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
    const { Attributes } = yield docClient.send(command);
    return Attributes;
});
exports.modelUpdateJournalEntryById = modelUpdateJournalEntryById;
// Delete a journal entry by ID
const modelDeleteJournalEntryById = (userId, id) => __awaiter(void 0, void 0, void 0, function* () {
    const command = new lib_dynamodb_1.DeleteCommand({
        TableName: 'Journal-Entries',
        Key: { userId, id },
    });
    yield docClient.send(command);
});
exports.modelDeleteJournalEntryById = modelDeleteJournalEntryById;
