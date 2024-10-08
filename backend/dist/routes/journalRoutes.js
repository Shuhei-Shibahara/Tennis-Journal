"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JournalController_1 = require("../controllers/JournalController");
const router = express_1.default.Router();
router.post('/', JournalController_1.createJournalEntry); // Create a new entry
router.get('/user/:userId', JournalController_1.getJournalEntries); // Get all entries for a user
router.get('/:id', JournalController_1.getJournalEntryById); // Get a specific entry by ID
router.put('/:id', JournalController_1.updateJournalEntry); // Update an entry by ID
router.delete('/:id', JournalController_1.deleteJournalEntry); // Delete an entry by ID
exports.default = router;
