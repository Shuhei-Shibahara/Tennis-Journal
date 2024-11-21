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
exports.deleteJournalEntryById = exports.updateJournalEntryById = exports.getJournalEntryById = exports.getJournalEntriesByUserId = exports.createJournalEntry = void 0;
const uuid_1 = require("uuid");
const Journal_1 = require("../models/Journal");
// Create a new journal entry
const createJournalEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!(user === null || user === void 0 ? void 0 : user.userId)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { date, opponent, tournamentName, location, courtSurface, strengths, weaknesses, lessonsLearned, result, score, stats } = req.body;
        if (!date || !opponent || !tournamentName || !location || !courtSurface || !strengths || !weaknesses || !lessonsLearned || !result || !score) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const journalData = {
            userId: user.userId,
            entryId: (0, uuid_1.v4)(),
            date,
            opponent,
            tournamentName,
            location,
            courtSurface,
            strengths,
            weaknesses,
            lessonsLearned,
            result,
            score,
            stats: stats || {}, // Default to an empty object if stats are not provided
        };
        yield (0, Journal_1.modelCreateJournalEntry)(journalData);
        res.status(201).json({ message: 'Journal entry created successfully', journal: journalData });
    }
    catch (error) {
        console.error('Error creating journal entry:', error);
        res.status(500).json({ message: 'Failed to create journal entry', error });
    }
});
exports.createJournalEntry = createJournalEntry;
// Get all journal entries for a user
const getJournalEntriesByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!(user === null || user === void 0 ? void 0 : user.userId)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const journals = yield (0, Journal_1.modelGetJournalEntriesByUserId)(user.userId);
        res.status(200).json({ message: 'Journal entries fetched successfully', journals });
    }
    catch (error) {
        console.error('Error fetching journal entries:', error);
        res.status(500).json({ message: 'Failed to fetch journal entries', error });
    }
});
exports.getJournalEntriesByUserId = getJournalEntriesByUserId;
// Get a specific journal entry by ID
const getJournalEntryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!(user === null || user === void 0 ? void 0 : user.userId)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { entryId } = req.params;
        const journal = yield (0, Journal_1.modelGetJournalEntryById)(user.userId, entryId);
        if (!journal) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }
        res.status(200).json({ message: 'Journal entry fetched successfully', journal });
    }
    catch (error) {
        console.error('Error fetching journal entry:', error);
        res.status(500).json({ message: 'Failed to fetch journal entry', error });
    }
});
exports.getJournalEntryById = getJournalEntryById;
// Update a specific journal entry by ID
const updateJournalEntryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!(user === null || user === void 0 ? void 0 : user.userId)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { entryId } = req.params;
        const updates = req.body;
        const updatedJournal = yield (0, Journal_1.modelUpdateJournalEntryById)(user.userId, entryId, updates);
        if (!updatedJournal) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }
        res.status(200).json({ message: 'Journal entry updated successfully', journal: updatedJournal });
    }
    catch (error) {
        console.error('Error updating journal entry:', error);
        res.status(500).json({ message: 'Failed to update journal entry', error });
    }
});
exports.updateJournalEntryById = updateJournalEntryById;
// Delete a specific journal entry by ID
const deleteJournalEntryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!(user === null || user === void 0 ? void 0 : user.userId)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { entryId } = req.params;
        yield (0, Journal_1.modelDeleteJournalEntryById)(user.userId, entryId);
        res.status(200).json({ message: 'Journal entry deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting journal entry:', error);
        res.status(500).json({ message: 'Failed to delete journal entry', error });
    }
});
exports.deleteJournalEntryById = deleteJournalEntryById;
