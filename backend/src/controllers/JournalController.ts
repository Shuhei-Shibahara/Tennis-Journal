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
    const user = req.user as { userId: string } | undefined;
    if (!user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { date, opponent, tournamentName, location, courtSurface, strengths, weaknesses, lessonsLearned, result, score, stats } = req.body;

    if (!date || !opponent || !tournamentName || !location || !courtSurface || !strengths || !weaknesses || !lessonsLearned || !result || !score) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const journalData = {
      userId: user.userId,
      entryId: uuidv4(),
      date,
      opponent,
      tournamentName,
      location,
      courtSurface,
      strengths,
      weaknesses,
      lessonsLearned,
      result,
      score,
      stats: stats || {}, // Default to an empty object if stats are not provided
    };

    await modelCreateJournalEntry(journalData);

    res.status(201).json({ message: 'Journal entry created successfully', journal: journalData });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ message: 'Failed to create journal entry', error });
  }
};

// Get all journal entries for a user
export const getJournalEntriesByUserId = async (req: Request, res: Response) => {
  try {
    const user = req.user as { userId: string } | undefined;
    
    if (!user?.userId) {
      return res.status(401).json({ message: 'Unauthorized - No user found' });
    }

    const entries = await modelGetJournalEntriesByUserId(user.userId);
    return res.status(200).json({ journals: entries });
  } catch (error) {
    console.error('Controller error:', error);
    return res.status(500).json({ 
      message: 'Error fetching journal entries',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get a specific journal entry by ID
export const getJournalEntryById = async (req: Request, res: Response) => {
  try {
    const user = req.user as { userId: string } | undefined;
    if (!user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { entryId } = req.params;

    const journal = await modelGetJournalEntryById(user.userId, entryId);

    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.status(200).json({ message: 'Journal entry fetched successfully', journal });
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ message: 'Failed to fetch journal entry', error });
  }
};

// Update a specific journal entry by ID
export const updateJournalEntryById = async (req: Request, res: Response) => {
  try {
    const user = req.user as { userId: string } | undefined;
    if (!user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { entryId } = req.params;
    const updates = req.body;

    const updatedJournal = await modelUpdateJournalEntryById(user.userId, entryId, updates);

    if (!updatedJournal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.status(200).json({ message: 'Journal entry updated successfully', journal: updatedJournal });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ message: 'Failed to update journal entry', error });
  }
};

// Delete a specific journal entry by ID
export const deleteJournalEntryById = async (req: Request, res: Response) => {
  try {
    const user = req.user as { userId: string } | undefined;
    const { entryId } = req.params;

    console.log('Delete request received:', { 
      userId: user?.userId, 
      entryId,
      params: req.params,
      url: req.url,
      path: req.path,
      baseUrl: req.baseUrl
    });

    if (!user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!entryId) {
      console.log('Missing entryId in request');
      return res.status(400).json({ message: 'Entry ID is required' });
    }

    // First check if the journal exists
    const journal = await modelGetJournalEntryById(user.userId, entryId);

    if (!journal) {
      console.log('Journal entry not found:', { userId: user.userId, entryId });
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    // Delete the journal entry
    const result = await modelDeleteJournalEntryById(user.userId, entryId);
    
    if (result) {
      console.log('Successfully deleted journal entry:', { userId: user.userId, entryId });
      return res.status(200).json({ message: 'Journal entry deleted successfully' });
    } else {
      console.log('Failed to delete journal entry:', { userId: user.userId, entryId });
      return res.status(500).json({ message: 'Failed to delete journal entry' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ 
      message: 'Failed to delete journal entry',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
