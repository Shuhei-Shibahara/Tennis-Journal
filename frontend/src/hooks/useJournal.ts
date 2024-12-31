import { useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { journalService } from '../services/api';
import { JournalEntry } from '../types';

export const useJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state: RootState) => state.session.user?.userId);

  // Use a ref to track if we're currently fetching
  const isFetchingRef = useRef(false);

  const fetchEntries = useCallback(async () => {
    if (isFetchingRef.current) return; // Prevent multiple simultaneous fetches
    
    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError('');

      if (!userId) {
        setError('Please log in to view your entries');
        return;
      }

      const data = await journalService.getEntries(userId);
      setEntries(data || []);
    } catch (error: any) {
      console.error('Error fetching entries:', error);
      if (error.response?.status === 401) {
        setError('Please log in again to view your entries');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch entries');
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [userId]);

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
      if (!entryId) {
        throw new Error('Entry ID is required');
      }

      await journalService.deleteEntry(entryId);
      setEntries(entries.filter(entry => entry.entryId !== entryId));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete entry.';
      setError(errorMessage);
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