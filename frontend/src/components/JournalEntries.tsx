import React, { useEffect, useState } from 'react';
import { useJournal } from '../hooks/useJournal';
import JournalEntryCard from './shared/JournalEntryCard';
import { JournalEntry } from '../types';

const JournalEntries: React.FC = () => {
  const { entries, error, loading, fetchEntries, updateEntry, deleteEntry } = useJournal();
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'location'>('date');

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntryId(entry.entryId);
  };

  const handleDelete = async (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteEntry(entryId);
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  const sortedEntries = [...entries].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return a.location.localeCompare(b.location);
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Journal Entries</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {entries.length === 0 && !error && (
        <p className="text-center">No journal entries found.</p>
      )}

      <div className="mb-6 flex justify-end">
        <label className="mr-2 font-semibold text-gray-600">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'location')}
          className="border border-gray-300 rounded p-2"
        >
          <option value="date">Date</option>
          <option value="location">Location</option>
        </select>
      </div>

      <ul className="space-y-6 max-w-4xl mx-auto">
        {sortedEntries.map((entry) => (
          <JournalEntryCard
            key={entry.entryId}
            entry={entry}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isEditing={editingEntryId === entry.entryId}
          />
        ))}
      </ul>
    </div>
  );
};

export default JournalEntries;

