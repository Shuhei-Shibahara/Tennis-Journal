import { Request, Response } from 'express';
import { createJournalEntry, getJournalEntriesByUserId, getJournalEntryById, updateJournalEntryById, deleteJournalEntryById } from '../models/Journal';
import { IJournal } from '../models/Journal';

// Create a new journal entry
export const createJournalEntryHandler = async (req: Request, res: Response) => {
  try {
    const { userId, date, opponent, tournamentName, location, courtSurface, strengths, weaknesses, lessonsLearned } = req.body;

    const newJournalEntry: IJournal = {
      userId,
      date,
      opponent,
      tournamentName,
      location,
      courtSurface,
      strengths,
      weaknesses,
      lessonsLearned,
    };

    await createJournalEntry(newJournalEntry);
    res.status(201).json({ message: 'Journal entry created successfully' });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ message: 'Error creating journal entry', error });
  }
};

// Get all journal entries for a specific user
export const getJournalEntriesHandler = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const entries = await getJournalEntriesByUserId(userId); // Fetch entries for the user
    return res.status(200).json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return res.status(500).json({ message: 'Failed to fetch journal entries' });
  }
};

// Get a specific journal entry by ID
export const getJournalEntryByIdHandler = async (req: Request, res: Response) => {
  try {
    const entryId = req.params.id;
    const journalEntry = await getJournalEntryById(entryId); // Modify this function in your model

    if (!journalEntry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.status(200).json(journalEntry);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ message: 'Error fetching journal entry', error });
  }
};

// Update a journal entry by ID
export const updateJournalEntryHandler = async (req: Request, res: Response) => {
  try {
    const entryId = req.params.id;
    const updatedEntry = await updateJournalEntryById(entryId, req.body); // Modify this function in your model

    if (!updatedEntry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ message: 'Error updating journal entry', error });
  }
};

// Delete a journal entry by ID
export const deleteJournalEntryHandler = async (req: Request, res: Response) => {
  try {
    const entryId = req.params.id;
    const deletedEntry = await deleteJournalEntryById(entryId); // Modify this function in your model

    if (!deletedEntry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.status(200).json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ message: 'Error deleting journal entry', error });
  }
};
