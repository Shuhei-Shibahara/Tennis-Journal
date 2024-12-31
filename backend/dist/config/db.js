import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
// Verify AWS credentials are loaded
console.log('AWS Config:', {
    region: process.env.AWS_REGION,
    hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
    hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
});
// Initialize DynamoDB client with explicit credentials
export const dynamoDBClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});
