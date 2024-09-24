import express from 'express';
import { createJournalEntry,getJournalEntries, getJournalEntryById, updateJournalEntry,deleteJournalEntry} from '../controllers/JournalController';

const router = express.Router();

router.post('/', createJournalEntry); // Create a new entry
router.get('/user/:userId', getJournalEntries); // Get all entries for a user
router.get('/:id', getJournalEntryById); // Get a specific entry by ID
router.put('/:id', updateJournalEntry); // Update an entry by ID
router.delete('/:id', deleteJournalEntry); // Delete an entry by ID

export default router;