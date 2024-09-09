"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const router = (0, express_1.Router)();
// User routes
router.post('/', UserController_1.createUser); // Create a new user
router.get('/', UserController_1.getUsers); // Get all users
router.get('/:id', UserController_1.getUserById); // Get a user by ID
router.put('/:id', UserController_1.updateUser); // Update a user by ID
router.delete('/:id', UserController_1.deleteUser); // Delete a user by ID
exports.default = router;
