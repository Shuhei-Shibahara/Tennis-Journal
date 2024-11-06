import express from 'express';
import {
  createJournalEntry,
  getJournalEntriesByUserId,
  getJournalEntryById,
  updateJournalEntryById,
  deleteJournalEntryById,
} from '../controllers/JournalController';

const router = express.Router();

// Create a new entry
router.post('/', createJournalEntry);

// Get all entries for a specific user
router.get('/user/:userId', getJournalEntriesByUserId);

// Get a specific entry by ID
router.get('/:id', getJournalEntryById);

// Update an entry by ID
router.put('/:id', updateJournalEntryById);

// Delete an entry by ID
router.delete('/:id', deleteJournalEntryById);

export default router;

