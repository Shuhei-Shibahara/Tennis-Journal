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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
// Initialize DynamoDB client
const dynamoDBClient = new client_dynamodb_1.DynamoDBClient({ region: 'us-west-2' });
const dynamoDB = lib_dynamodb_1.DynamoDBDocumentClient.from(dynamoDBClient); // Create a document client
// Function to get user data from DynamoDB
const getUserData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: 'Users',
        Key: {
            userId: userId, // Correctly using the partition key
        },
    };
    try {
        const data = yield dynamoDB.send(new lib_dynamodb_1.GetCommand(params)); // Use the GetCommand
        return data.Item; // Return the user data
    }
    catch (error) {
        console.error('Error fetching user data:', error);
        throw error; // Handle or rethrow error as needed
    }
});
// Middleware to authenticate and fetch user data
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        // Ensure JWT_SECRET is defined
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT secret is not defined'); // Throw error if secret is not set
        }
        // Decode the token
        const decoded = jsonwebtoken_1.default.verify(token, secret); // Use the defined secret
        const userId = decoded.userId; // Ensure this matches your token payload
        console.log('Decoded user ID:', userId);
        // Fetch user data
        const userData = yield getUserData(userId);
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = userData; // Attach user data to request
        next(); // Proceed to the next middleware/route
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
});
exports.default = authMiddleware;
