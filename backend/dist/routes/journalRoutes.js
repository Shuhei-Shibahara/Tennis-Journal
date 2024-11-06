"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const JournalController_1 = require("../controllers/JournalController");
const router = express_1.default.Router();
// Apply auth middleware to all journal routes
router.use(authMiddleware_1.default);
// Create a journal entry
router.post('/', JournalController_1.createJournalEntry);
// Get journal entries by userId (change this to use userId in the path)
router.get('/user/:userId', JournalController_1.getJournalEntriesByUserId); // This is the new route for fetching by userId
// Get a specific journal entry by id
router.get('/:id', JournalController_1.getJournalEntryById);
// Update a journal entry by id
router.put('/:id', JournalController_1.updateJournalEntryById);
// Delete a journal entry by id
router.delete('/:id', JournalController_1.deleteJournalEntryById);
exports.default = router;
