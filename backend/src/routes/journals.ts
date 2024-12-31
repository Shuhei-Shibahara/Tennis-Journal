import express from 'express';
import { 
  createJournalEntry,
  getJournalEntriesByUserId,
  getJournalEntryById,
  updateJournalEntryById,
  deleteJournalEntryById
} from '../controllers/JournalController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Add request logging middleware
router.use((req, res, next) => {
  console.log('Journal Route Request:', {
    method: req.method,
    path: req.path,
    params: req.params,
    body: req.body,
    url: req.url
  });
  next();
});

// Journal routes
router.post('/', createJournalEntry);
router.get('/user/:userId', getJournalEntriesByUserId);
router.get('/:entryId', getJournalEntryById);
router.put('/:entryId', updateJournalEntryById);
router.delete('/:entryId', deleteJournalEntryById);

export { router as default }; 