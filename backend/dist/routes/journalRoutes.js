"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const JournalController_1 = require("../controllers/JournalController");
const router = express_1.default.Router();
router.use(authMiddleware_1.default); // Apply auth middleware to all journal routes
router.post('/', JournalController_1.createJournalEntry);
router.get('/', JournalController_1.getJournalEntriesByUserId);
router.get('/:id', JournalController_1.getJournalEntryById);
router.put('/:id', JournalController_1.updateJournalEntryById);
router.delete('/:id', JournalController_1.deleteJournalEntryById);
exports.default = router;
