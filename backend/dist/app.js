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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const authMiddleware_1 = __importDefault(require("./middlewares/authMiddleware"));
const journalRoutes_1 = __importDefault(require("./routes/journalRoutes"));
dotenv_1.default.config(); // Load environment variables from .env file
const app = (0, express_1.default)();
// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000', // Change this to your frontend's URL if different
    credentials: true, // Allow credentials (e.g., cookies)
};
// Middleware
app.use((0, cors_1.default)(corsOptions)); // Use CORS with the specified options
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
// Connect to MongoDB
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect('mongodb+srv://Shuhei:4s98QkhAr2IDE54A@tennis-journal.ztmmw.mongodb.net/?retryWrites=true&w=majority&appName=Tennis-Journal'); // Replace with your actual connection string
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('MongoDB connection error:', error.message);
            process.exit(1); // Exit process with failure
        }
        else {
            console.error('Unexpected error:', error);
            process.exit(1);
        }
    }
});
connectDB();
// Define a simple route
app.get('/', (req, res) => {
    console.log('hello world');
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
app.use('/api/journals', authMiddleware_1.default, journalRoutes_1.default);
