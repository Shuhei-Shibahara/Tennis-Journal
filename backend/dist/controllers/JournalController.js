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
exports.deleteJournalEntry = exports.updateJournalEntry = exports.getJournalEntryById = exports.getJournalEntries = exports.createJournalEntry = void 0;
const Journal_1 = __importDefault(require("../models/Journal"));
// Create a new journal entry
const createJournalEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, date, opponent, tournamentName, location, courtSurface, strengths, weaknesses, lessonsLearned } = req.body;
        const newJournalEntry = new Journal_1.default({
            userId,
            date,
            opponent,
            tournamentName,
            location,
            courtSurface,
            strengths,
            weaknesses,
            lessonsLearned,
        });
        const savedJournalEntry = yield newJournalEntry.save();
        res.status(201).json(savedJournalEntry);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating journal entry', error });
    }
});
exports.createJournalEntry = createJournalEntry;
// Get all journal entries for a specific user
const getJournalEntries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const journalEntries = yield Journal_1.default.find({ userId });
        res.status(200).json(journalEntries);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching journal entries', error });
    }
});
exports.getJournalEntries = getJournalEntries;
// Get a specific journal entry by ID
const getJournalEntryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entryId = req.params.id;
        const journalEntry = yield Journal_1.default.findById(entryId);
        if (!journalEntry) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }
        res.status(200).json(journalEntry);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching journal entry', error });
    }
});
exports.getJournalEntryById = getJournalEntryById;
// Update a journal entry by ID
const updateJournalEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entryId = req.params.id;
        const updatedEntry = yield Journal_1.default.findByIdAndUpdate(entryId, req.body, { new: true });
        if (!updatedEntry) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }
        res.status(200).json(updatedEntry);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating journal entry', error });
    }
});
exports.updateJournalEntry = updateJournalEntry;
// Delete a journal entry by ID
const deleteJournalEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entryId = req.params.id;
        const deletedEntry = yield Journal_1.default.findByIdAndDelete(entryId);
        if (!deletedEntry) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }
        res.status(200).json({ message: 'Journal entry deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting journal entry', error });
    }
});
exports.deleteJournalEntry = deleteJournalEntry;
