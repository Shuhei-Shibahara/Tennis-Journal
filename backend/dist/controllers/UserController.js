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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const User_1 = require("../models/User");
// Create a new user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, email, password } = req.body; // Adjusted to include userId
        const newUser = { userId, email, password }; // Creating a new user object
        yield (0, User_1.createUserInDB)(newUser);
        res.status(201).json(newUser); // Respond with the created user data
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user', error });
    }
});
exports.createUser = createUser;
// Get all users
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, User_1.getUsersFromDB)();
        res.status(200).json(users); // Respond with the list of users
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users', error });
    }
});
exports.getUsers = getUsers;
// Get a user by ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id; // Using userId from route parameters
        const user = yield (0, User_1.getUserByIdFromDB)(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user); // Respond with the found user
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user', error });
    }
});
exports.getUserById = getUserById;
// Update a user by ID
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id; // Using userId from route parameters
        const updatedUser = yield (0, User_1.updateUserInDB)(userId, req.body); // Pass the request body for updates
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser); // Respond with the updated user
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user', error });
    }
});
exports.updateUser = updateUser;
// Delete a user by ID
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id; // Using userId from route parameters
        yield (0, User_1.deleteUserFromDB)(userId); // Call the delete function
        res.status(200).json({ message: 'User deleted successfully' }); // Respond with success message
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
});
exports.deleteUser = deleteUser;
