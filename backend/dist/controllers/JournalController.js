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
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const entry = Object.assign(Object.assign({}, req.body), { id: (0, uuid_1.v4)(), userId });
        yield (0, Journal_1.modelCreateJournalEntry)(entry);
        res.status(201).json(entry);
    }
    catch (error) {
        console.error('Error creating journal entry:', error);
        res.status(500).json({ error: 'Failed to create journal entry' });
    }
});
exports.createJournalEntry = createJournalEntry;
// Get all journal entries for the authenticated user
const getJournalEntriesByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const entries = yield (0, Journal_1.modelGetJournalEntriesByUserId)(userId);
        res.status(200).json(entries);
    }
    catch (error) {
        console.error('Error fetching journal entries:', error);
        res.status(500).json({ error: 'Failed to fetch journal entries' });
    }
});
exports.getJournalEntriesByUserId = getJournalEntriesByUserId;
// Get a specific journal entry by ID
const getJournalEntryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const entry = yield (0, Journal_1.modelGetJournalEntryById)(userId, id);
        if (!entry) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        res.status(200).json(entry);
    }
    catch (error) {
        console.error('Error fetching journal entry:', error);
        res.status(500).json({ error: 'Failed to fetch journal entry' });
    }
});
exports.getJournalEntryById = getJournalEntryById;
// Update a journal entry by ID
const updateJournalEntryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { id } = req.params;
        const updates = req.body;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const updatedEntry = yield (0, Journal_1.modelUpdateJournalEntryById)(userId, id, updates);
        if (!updatedEntry) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        res.status(200).json(updatedEntry);
    }
    catch (error) {
        console.error('Error updating journal entry:', error);
        res.status(500).json({ error: 'Failed to update journal entry' });
    }
});
exports.updateJournalEntryById = updateJournalEntryById;
// Delete a journal entry by ID
const deleteJournalEntryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        yield (0, Journal_1.modelDeleteJournalEntryById)(userId, id);
        res.status(200).json({ message: 'Entry deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting journal entry:', error);
        res.status(500).json({ error: 'Failed to delete journal entry' });
    }
});
exports.deleteJournalEntryById = deleteJournalEntryById;
