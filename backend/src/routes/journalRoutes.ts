import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import {
  createJournalEntry,
  getJournalEntriesByUserId,
  getJournalEntryById,
  updateJournalEntryById,
  deleteJournalEntryById,
} from '../controllers/JournalController';

const router = express.Router();

// Apply auth middleware to all journal routes
router.use(authMiddleware);

// Create a journal entry
router.post('/', createJournalEntry);

// Get journal entries by userId (change this to use userId in the path)
router.get('/user/:userId', getJournalEntriesByUserId);  // This is the new route for fetching by userId

// Get a specific journal entry by id
router.get('/:id', getJournalEntryById);

// Update a journal entry by id
router.put('/:id', updateJournalEntryById);

// Delete a journal entry by id
router.delete('/:id', deleteJournalEntryById);

export default router;