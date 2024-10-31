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
exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const uuid_1 = require("uuid"); // Import uuid
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body; // Removed id from body for automatic generation
        // Hash the password before storing it
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = { userId: (0, uuid_1.v4)(), email, password: hashedPassword }; // Use 'userId' instead of 'id'
        // Ensure the createUserInDB function expects IUser
        yield (0, User_1.createUserInDB)(newUser);
        res.status(201).json({ email });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user', error });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user by email
        const users = yield (0, User_1.getUsersFromDB)();
        const user = users === null || users === void 0 ? void 0 : users.find((u) => u.email === email);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        // Compare password
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid credentials' });
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Use 'userId'
        res.json({ token, user: { userId: user.userId, email: user.email } }); // Use 'userId'
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in', error });
    }
});
exports.login = login;
