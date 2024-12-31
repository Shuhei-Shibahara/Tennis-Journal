import jwt from 'jsonwebtoken';
import { GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
const dynamoDBClient = new DynamoDBClient({ region: 'us-west-2' });
const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);
const getUserData = async (userId) => {
    const params = {
        TableName: 'Users',
        Key: { userId },
    };
    try {
        const data = await dynamoDB.send(new GetCommand(params));
        return data.Item;
    }
    catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};
const authMiddleware = async (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT secret is not defined');
        }
        const decoded = jwt.verify(token, secret);
        const userId = decoded.userId;
        const userData = await getUserData(userId);
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = userData; // Attach user data to request
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
export default authMiddleware;
