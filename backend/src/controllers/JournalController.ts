import { Request, Response } from 'express';
import Journal, { IJournal } from '../models/Journal';

// Create a new journal entry
export const createJournalEntry = async (req: Request, res: Response) => {
  try {
    const { userId, date, opponent, tournamentName, location, courtSurface, strengths, weaknesses, lessonsLearned } = req.body;

    const newJournalEntry: IJournal = new Journal({
      userId,
      date,
      opponent,
      tournamentName,
      location,
      courtSurface,
      strengths,
      weaknesses,
      lessonsLearned,
    });

    const savedJournalEntry = await newJournalEntry.save();
    res.status(201).json(savedJournalEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error creating journal entry', error });
  }
};

// Get all journal entries for a specific user
export const getJournalEntries = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const entries = await Journal.find({ userId }); // Fetch entries for the user
    return res.status(200).json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return res.status(500).json({ message: 'Failed to fetch journal entries' });
  }
};

// Get a specific journal entry by ID
export const getJournalEntryById = async (req: Request, res: Response) => {
  try {
    const entryId = req.params.id;
    const journalEntry = await Journal.findById(entryId);

    if (!journalEntry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.status(200).json(journalEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching journal entry', error });
  }
};

// Update a journal entry by ID
export const updateJournalEntry = async (req: Request, res: Response) => {
  try {
    const entryId = req.params.id;
    const updatedEntry = await Journal.findByIdAndUpdate(entryId, req.body, { new: true });

    if (!updatedEntry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.status(200).json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error updating journal entry', error });
  }
};

// Delete a journal entry by ID
export const deleteJournalEntry = async (req: Request, res: Response) => {
  try {
    const entryId = req.params.id;
    const deletedEntry = await Journal.findByIdAndDelete(entryId);

    if (!deletedEntry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.status(200).json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting journal entry', error });
  }
};