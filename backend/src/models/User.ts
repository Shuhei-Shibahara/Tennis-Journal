import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, UpdateCommandInput, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.USER_TABLE || 'Users'; // Specify your DynamoDB table name here

// Update the IUser interface to reflect the correct property name
export interface IUser {
  userId: string; // Changed from 'userid' to 'userId'
  email: string;
  password: string; // Ensure to hash passwords before storing
}

// Update the createUserInDB function to use 'userId'
export const createUserInDB = async (user: IUser) => {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      userId: user.userId, // Use userId instead of id
      email: user.email,
      password: user.password, // Avoid exposing password in responses
    },
  };

  console.log("DynamoDB Put Command Params:", params); // Log the params being sent

  return dynamoDB.send(new PutCommand(params));
};

// Fetch all users from the database
export const getUsersFromDB = async () => {
  const params = {
    TableName: TABLE_NAME,
  };

  const { Items } = await dynamoDB.send(new ScanCommand(params));
  return Items;
};

// Fetch a user by userId
export const getUserByIdFromDB = async (userId: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { userId }, // Use userId as the key
  };

  const { Item } = await dynamoDB.send(new GetCommand(params));
  return Item;
};

// Update a user in the database
export const updateUserInDB = async (userId: string, updatedData: Partial<IUser>) => {
  const updateExpressions: string[] = [];
  const expressionAttributeNames: { [key: string]: string } = {};
  const expressionAttributeValues: { [key: string]: any } = {};

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

  const params: UpdateCommandInput = {
    TableName: TABLE_NAME,
    Key: { userId }, // Adjusted to use 'userId' as the key
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'UPDATED_NEW' as const, // Using 'as const' to ensure the literal type is preserved
  };

  return dynamoDB.send(new UpdateCommand(params));
};

// Delete a user from the database
export const deleteUserFromDB = async (userId: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { userId }, // Use userId as the key
  };

  return dynamoDB.send(new DeleteCommand(params));
};
