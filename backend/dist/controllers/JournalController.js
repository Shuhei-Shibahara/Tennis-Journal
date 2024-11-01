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
exports.deleteJournalEntryHandler = exports.updateJournalEntryHandler = exports.getJournalEntryByIdHandler = exports.getJournalEntriesHandler = exports.createJournalEntryHandler = void 0;
const Journal_1 = require("../models/Journal");
// Create a new journal entry
const createJournalEntryHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, date, opponent, tournamentName, location, courtSurface, strengths, weaknesses, lessonsLearned } = req.body;
        const newJournalEntry = {
            userId,
            date,
            opponent,
            tournamentName,
            location,
            courtSurface,
            strengths,
            weaknesses,
            lessonsLearned,
        };
        yield (0, Journal_1.createJournalEntry)(newJournalEntry);
        res.status(201).json({ message: 'Journal entry created successfully' });
    }
    catch (error) {
        console.error('Error creating journal entry:', error);
        res.status(500).json({ message: 'Error creating journal entry', error });
    }
});
exports.createJournalEntryHandler = createJournalEntryHandler;
// Get all journal entries for a specific user
const getJournalEntriesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const entries = yield (0, Journal_1.getJournalEntriesByUserId)(userId); // Fetch entries for the user
        return res.status(200).json(entries);
    }
    catch (error) {
        console.error('Error fetching journal entries:', error);
        return res.status(500).json({ message: 'Failed to fetch journal entries' });
    }
});
exports.getJournalEntriesHandler = getJournalEntriesHandler;
// Get a specific journal entry by ID
const getJournalEntryByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entryId = req.params.id;
        const journalEntry = yield (0, Journal_1.getJournalEntryById)(entryId); // Modify this function in your model
        if (!journalEntry) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }
        res.status(200).json(journalEntry);
    }
    catch (error) {
        console.error('Error fetching journal entry:', error);
        res.status(500).json({ message: 'Error fetching journal entry', error });
    }
});
exports.getJournalEntryByIdHandler = getJournalEntryByIdHandler;
// Update a journal entry by ID
const updateJournalEntryHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entryId = req.params.id;
        const updatedEntry = yield (0, Journal_1.updateJournalEntryById)(entryId, req.body); // Modify this function in your model
        if (!updatedEntry) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }
        res.status(200).json(updatedEntry);
    }
    catch (error) {
        console.error('Error updating journal entry:', error);
        res.status(500).json({ message: 'Error updating journal entry', error });
    }
});
exports.updateJournalEntryHandler = updateJournalEntryHandler;
// Delete a journal entry by ID
const deleteJournalEntryHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const entryId = req.params.id;
        const deletedEntry = yield (0, Journal_1.deleteJournalEntryById)(entryId); // Modify this function in your model
        if (!deletedEntry) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }
        res.status(200).json({ message: 'Journal entry deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting journal entry:', error);
        res.status(500).json({ message: 'Error deleting journal entry', error });
    }
});
exports.deleteJournalEntryHandler = deleteJournalEntryHandler;
