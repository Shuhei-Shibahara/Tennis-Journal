"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JournalController_1 = require("../controllers/JournalController");
const router = express_1.default.Router();
// Create a new entry
router.post('/', JournalController_1.createJournalEntry);
// Get all entries for a specific user
router.get('/user/:userId', JournalController_1.getJournalEntriesByUserId);
// Get a specific entry by ID
router.get('/:id', JournalController_1.getJournalEntryById);
// Update an entry by ID
router.put('/:id', JournalController_1.updateJournalEntryById);
// Delete an entry by ID
router.delete('/:id', JournalController_1.deleteJournalEntryById);
exports.default = router;
