import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  modelCreateJournalEntry,
  modelGetJournalEntriesByUserId,
  modelGetJournalEntryById,
  modelUpdateJournalEntryById,
  modelDeleteJournalEntryById,
} from '../models/Journal';

// Create a new journal entry
export const createJournalEntry = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const entry = { ...req.body, id: uuidv4(), userId };
    await modelCreateJournalEntry(entry);
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ error: 'Failed to create journal entry' });
  }
};

// Get all journal entries for the authenticated user
export const getJournalEntriesByUserId = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const entries = await modelGetJournalEntriesByUserId(userId);
    res.status(200).json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
};

// Get a specific journal entry by ID
export const getJournalEntryById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const entry = await modelGetJournalEntryById(userId, id);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.status(200).json(entry);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ error: 'Failed to fetch journal entry' });
  }
};

// Update a journal entry by ID
export const updateJournalEntryById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const updates = req.body;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updatedEntry = await modelUpdateJournalEntryById(userId, id, updates);
    if (!updatedEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
};

// Delete a journal entry by ID
export const deleteJournalEntryById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await modelDeleteJournalEntryById(userId, id);
    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ error: 'Failed to delete journal entry' });
  }
};
