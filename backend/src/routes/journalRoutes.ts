import express from 'express';
import { createJournalEntryHandler,getJournalEntriesHandler, getJournalEntryByIdHandler, updateJournalEntryHandler,deleteJournalEntryHandler} from '../controllers/JournalController';

const router = express.Router();

router.post('/', createJournalEntryHandler); // Create a new entry
router.get('/user/:userId', getJournalEntriesHandler); // Get all entries for a user
router.get('/:id', getJournalEntryByIdHandler); // Get a specific entry by ID
router.put('/:id', updateJournalEntryHandler); // Update an entry by ID
router.delete('/:id', deleteJournalEntryHandler); // Delete an entry by ID

export default router;