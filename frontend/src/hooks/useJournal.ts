import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { journalService } from '../services/api';
import { JournalEntry } from '../types';

export const useJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state: RootState) => state.session.user?.userId);

  const fetchEntries = async () => {
    if (!userId) {
      setError('User ID is undefined.');
      return;
    }
    
    setLoading(true);
    try {
      const journalEntries = await journalService.getEntries(userId);
      setEntries(journalEntries);
    } catch (error: any) {
      console.error('Error fetching journal entries:', error);
      setError('Failed to fetch journal entries.');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (data: Omit<JournalEntry, 'entryId'>) => {
    try {
      const newEntry = await journalService.createEntry(data);
      setEntries([...entries, newEntry]);
      return newEntry;
    } catch (error: any) {
      setError('Failed to create entry.');
      throw error;
    }
  };

  const updateEntry = async (entryId: string, data: Partial<JournalEntry>) => {
    try {
      const updatedEntry = await journalService.updateEntry(entryId, data);
      setEntries(entries.map(entry => 
        entry.entryId === entryId ? { ...entry, ...updatedEntry } : entry
      ));
      return updatedEntry;
    } catch (error: any) {
      setError('Failed to update entry.');
      throw error;
    }
  };

  const deleteEntry = async (entryId: string) => {
    try {
      await journalService.deleteEntry(entryId);
      setEntries(entries.filter(entry => entry.entryId !== entryId));
    } catch (error: any) {
      setError('Failed to delete entry.');
      throw error;
    }
  };

  return {
    entries,
    error,
    loading,
    fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    setError,
  };
}; 