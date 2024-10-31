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
exports.deleteUserFromDB = exports.updateUserInDB = exports.getUserByIdFromDB = exports.getUsersFromDB = exports.createUserInDB = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client = new client_dynamodb_1.DynamoDBClient({});
const dynamoDB = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.USER_TABLE || 'Users'; // Specify your DynamoDB table name here
// Update the createUserInDB function to use 'userId'
const createUserInDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: TABLE_NAME,
        Item: {
            userId: user.userId, // Use userId instead of id
            email: user.email,
            password: user.password, // Avoid exposing password in responses
        },
    };
    console.log("DynamoDB Put Command Params:", params); // Log the params being sent
    return dynamoDB.send(new lib_dynamodb_1.PutCommand(params));
});
exports.createUserInDB = createUserInDB;
// Fetch all users from the database
const getUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: TABLE_NAME,
    };
    const { Items } = yield dynamoDB.send(new lib_dynamodb_1.ScanCommand(params));
    return Items;
});
exports.getUsersFromDB = getUsersFromDB;
// Fetch a user by userId
const getUserByIdFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: TABLE_NAME,
        Key: { userId }, // Use userId as the key
    };
    const { Item } = yield dynamoDB.send(new lib_dynamodb_1.GetCommand(params));
    return Item;
});
exports.getUserByIdFromDB = getUserByIdFromDB;
// Update a user in the database
const updateUserInDB = (userId, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    // Create update expression based on provided fields
    if (updatedData.email) {
        updateExpressions.push('#email = :email');
        expressionAttributeNames['#email'] = 'email';
        expressionAttributeValues[':email'] = updatedData.email;
    }
    if (updatedData.password) {
        updateExpressions.push('#password = :password');
        expressionAttributeNames['#password'] = 'password';
        expressionAttributeValues[':password'] = updatedData.password;
    }
    const params = {
        TableName: TABLE_NAME,
        Key: { userId }, // Adjusted to use 'userId' as the key
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'UPDATED_NEW', // Using 'as const' to ensure the literal type is preserved
    };
    return dynamoDB.send(new lib_dynamodb_1.UpdateCommand(params));
});
exports.updateUserInDB = updateUserInDB;
// Delete a user from the database
const deleteUserFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: TABLE_NAME,
        Key: { userId }, // Use userId as the key
    };
    return dynamoDB.send(new lib_dynamodb_1.DeleteCommand(params));
});
exports.deleteUserFromDB = deleteUserFromDB;
