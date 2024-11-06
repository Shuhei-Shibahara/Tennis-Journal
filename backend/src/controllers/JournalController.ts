import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  modelCreateJournalEntry,
  modelGetJournalEntriesByUserId,
  modelGetJournalEntryById,
  modelUpdateJournalEntryById,
  modelDeleteJournalEntryById,
} from '../models/Journal';

export const createJournalEntry = async (req: Request, res: Response) => {
  try {
    const user = req.user as { userId: string } | undefined;
    if (!user || !user.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Create entryId using UUID instead of id
    const journalData = { ...req.body, userId: user.userId, entryId: uuidv4() };

    // Pass journalData with entryId to modelCreateJournalEntry
    await modelCreateJournalEntry(journalData);

    res.status(201).json({ message: 'Journal entry created', journal: journalData });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ message: 'Failed to create journal entry' });
  }
};

export const getJournalEntriesByUserId = async (req: Request, res: Response) => {
  try {
    const user = req.user as { userId: string } | undefined;
    if (!user || !user.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const journals = await modelGetJournalEntriesByUserId(user.userId);
    res.json(journals);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ message: 'Failed to fetch journal entries' });
  }
};

export const getJournalEntryById = async (req: Request, res: Response) => {
  try {
    const user = req.user as { userId: string } | undefined;
    if (!user || !user.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const journal = await modelGetJournalEntryById(user.userId, id);

    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.json(journal);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ message: 'Failed to fetch journal entry' });
  }
};

export const updateJournalEntryById = async (req: Request, res: Response) => {
  try {
    const user = req.user as { userId: string } | undefined;
    if (!user || !user.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const updates = req.body;
    const updatedJournal = await modelUpdateJournalEntryById(user.userId, id, updates);

    if (!updatedJournal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.json(updatedJournal);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ message: 'Failed to update journal entry' });
  }
};

export const deleteJournalEntryById = async (req: Request, res: Response) => {
  try {
    const user = req.user as { userId: string } | undefined;
    if (!user || !user.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    await modelDeleteJournalEntryById(user.userId, id);
    res.status(200).json({ message: 'Journal entry deleted' });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ message: 'Failed to delete journal entry' });
  }
};
