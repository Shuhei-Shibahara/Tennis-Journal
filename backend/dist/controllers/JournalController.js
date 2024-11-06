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
const createJournalEntry = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user || !user.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Ensure required fields are provided
        const { date, opponent, tournamentName, location, courtSurface, strengths, weaknesses, lessonsLearned } = req.body;
        if (!date || !opponent || !tournamentName || !location || !courtSurface || !strengths || !weaknesses || !lessonsLearned) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Create entryId using UUID for uniqueness
        const journalData = Object.assign(Object.assign({}, req.body), { userId: user.userId, entryId: (0, uuid_1.v4)() });
        // Pass journalData with entryId to modelCreateJournalEntry
        yield (0, Journal_1.modelCreateJournalEntry)(journalData);
        res.status(201).json({ message: 'Journal entry created', journal: journalData });
    }
    catch (error) {
        console.error('Error creating journal entry:', error);
        res.status(500).json({ message: 'Failed to create journal entry' });
    }
});
exports.createJournalEntry = createJournalEntry;
const getJournalEntriesByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user || !user.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const journals = yield (0, Journal_1.modelGetJournalEntriesByUserId)(user.userId);
        res.json(journals);
    }
    catch (error) {
        console.error('Error fetching journal entries:', error);
        res.status(500).json({ message: 'Failed to fetch journal entries' });
    }
});
exports.getJournalEntriesByUserId = getJournalEntriesByUserId;
const getJournalEntryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user || !user.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { entryId } = req.params;
        const journal = yield (0, Journal_1.modelGetJournalEntryById)(user.userId, entryId);
        if (!journal) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }
        res.json(journal);
    }
    catch (error) {
        console.error('Error fetching journal entry:', error);
        res.status(500).json({ message: 'Failed to fetch journal entry' });
    }
});
exports.getJournalEntryById = getJournalEntryById;
const updateJournalEntryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user || !user.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { entryId } = req.params;
        const updates = req.body;
        // Ensure you're passing the userId and entryId as keys for the update operation
        const updatedJournal = yield (0, Journal_1.modelUpdateJournalEntryById)(user.userId, entryId, updates);
        if (!updatedJournal) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }
        res.json(updatedJournal);
    }
    catch (error) {
        console.error('Error updating journal entry:', error);
        res.status(500).json({ message: 'Failed to update journal entry' });
    }
});
exports.updateJournalEntryById = updateJournalEntryById;
const deleteJournalEntryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user || !user.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { entryId } = req.params;
        // Ensure you're passing the userId and entryId for deletion
        yield (0, Journal_1.modelDeleteJournalEntryById)(user.userId, entryId);
        res.status(200).json({ message: 'Journal entry deleted' });
    }
    catch (error) {
        console.error('Error deleting journal entry:', error);
        res.status(500).json({ message: 'Failed to delete journal entry' });
    }
});
exports.deleteJournalEntryById = deleteJournalEntryById;
