import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { testTableStructure } from './models/Journal.js';
const verifyDynamoDBConnection = async () => {
    try {
        const client = new DynamoDBClient({
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
            }
        });
        await client.send(new ListTablesCommand({}));
        console.log('Successfully connected to DynamoDB');
    }
    catch (error) {
        console.error('Failed to connect to DynamoDB:', error);
        process.exit(1);
    }
};
// Initialize the app
const initializeApp = async () => {
    await verifyDynamoDBConnection();
    try {
        await testTableStructure();
    }
    catch (error) {
        console.error('Failed to verify table structure:', error);
    }
};
initializeApp();
