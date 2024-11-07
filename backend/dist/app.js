"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const authMiddleware_1 = __importDefault(require("./middlewares/authMiddleware"));
const journalRoutes_1 = __importDefault(require("./routes/journalRoutes"));
dotenv_1.default.config(); // Load environment variables from .env file
const app = (0, express_1.default)();
// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? 'https://your-netlify-url.netlify.app' // Replace with your actual Netlify URL
        : 'http://localhost:3000', // Localhost for development
    credentials: true, // Allow credentials (e.g., cookies)
};
// Middleware
app.use((0, cors_1.default)(corsOptions)); // Use CORS with the specified options
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
// Initialize DynamoDB client
const dynamoDBClient = new client_dynamodb_1.DynamoDBClient({ region: 'us-west-2' }); // Replace 'your-region' with the actual region
// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', authMiddleware_1.default, userRoutes_1.default);
app.use('/api/journals', journalRoutes_1.default);
