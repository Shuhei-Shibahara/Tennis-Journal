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

router.use(authMiddleware); // Apply auth middleware to all journal routes

router.post('/', createJournalEntry);
router.get('/', getJournalEntriesByUserId);
router.get('/:id', getJournalEntryById);
router.put('/:id', updateJournalEntryById);
router.delete('/:id', deleteJournalEntryById);

export default router;
