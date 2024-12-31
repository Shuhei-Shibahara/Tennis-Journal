import React, { useEffect, useState } from 'react';
import { useJournal } from '../hooks/useJournal';
import JournalEntryCard from './shared/JournalEntryCard';
import { JournalEntry } from '../types';
import { COURT_SURFACES } from '../constants';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const JournalEntries: React.FC = () => {
  const { entries, error, loading, fetchEntries, deleteEntry } = useJournal();
  const isAuthenticated = useSelector((state: RootState) => !!state.session.user);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'location' | 'result'>('date');
  const [filterBy, setFilterBy] = useState({
    surface: 'all',
    result: 'all',
    dateRange: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Use a ref to prevent multiple fetches
  const fetchedRef = React.useRef(false);

  useEffect(() => {
    if (isAuthenticated && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchEntries();
    }
  }, [isAuthenticated]); // Remove fetchEntries from dependencies

  // Reset the ref when authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      fetchedRef.current = false;
    }
  }, [isAuthenticated]);

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntryId(entry.entryId);
  };

  const handleDelete = async (entryId: string) => {
    if (!entryId) {
      setDeleteError('No entry ID provided');
      return;
    }

    try {
      console.log('Handling delete for entry:', entryId); // Debug log
      setDeleteError(null);
      await deleteEntry(entryId);
    } catch (error: any) {
      console.error('Delete error:', error);
      setDeleteError(error.response?.data?.message || 'Failed to delete entry');
    }
  };

  const filterEntries = (entries: JournalEntry[]) => {
    return entries.filter(entry => {
      const matchesSurface = filterBy.surface === 'all' || entry.courtSurface === filterBy.surface;
      const matchesResult = filterBy.result === 'all' || entry.result === filterBy.result;
      const matchesSearch = entry.tournamentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.opponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesDate = true;
      if (filterBy.dateRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = new Date(entry.date) >= weekAgo;
      } else if (filterBy.dateRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        matchesDate = new Date(entry.date) >= monthAgo;
      }

      return matchesSurface && matchesResult && matchesSearch && matchesDate;
    });
  };

  const sortEntries = (entries: JournalEntry[]) => {
    return [...entries].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'location':
          return a.location.localeCompare(b.location);
        case 'result':
          return (a.result === 'Win' ? -1 : 1) - (b.result === 'Win' ? -1 : 1);
        default:
          return 0;
      }
    });
  };

  const filteredAndSortedEntries = sortEntries(filterEntries(entries));
  const winCount = entries.filter(entry => entry.result === 'Win').length;
  const lossCount = entries.filter(entry => entry.result === 'Lose').length;

  const renderContent = () => {
    if (!isAuthenticated) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">Please log in to view your journal entries.</p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="text-center py-8">
          <p>Loading entries...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Your Match History</h2>
            
            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Total Matches</h3>
                <p className="text-2xl font-bold text-blue-600">{entries.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800">Wins</h3>
                <p className="text-2xl font-bold text-green-600">{winCount}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800">Losses</h3>
                <p className="text-2xl font-bold text-red-600">{lossCount}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800">Win Rate</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {entries.length ? Math.round((winCount / entries.length) * 100) : 0}%
                </p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <input
                type="text"
                placeholder="Search matches..."
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="location">Sort by Location</option>
                <option value="result">Sort by Result</option>
              </select>

              <select
                value={filterBy.surface}
                onChange={(e) => setFilterBy(prev => ({ ...prev, surface: e.target.value }))}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Surfaces</option>
                {COURT_SURFACES.map(surface => (
                  <option key={surface} value={surface}>{surface}</option>
                ))}
              </select>

              <select
                value={filterBy.result}
                onChange={(e) => setFilterBy(prev => ({ ...prev, result: e.target.value }))}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Results</option>
                <option value="Win">Wins</option>
                <option value="Lose">Losses</option>
              </select>

              <select
                value={filterBy.dateRange}
                onChange={(e) => setFilterBy(prev => ({ ...prev, dateRange: e.target.value }))}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
            </div>

            {deleteError && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {deleteError}
              </div>
            )}

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            {filteredAndSortedEntries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  {entries.length === 0 
                    ? "No journal entries found. Start by adding your first match!"
                    : "No matches found with the current filters."}
                </p>
              </div>
            ) : (
              <ul className="space-y-6">
                {filteredAndSortedEntries.map((entry) => (
                  <JournalEntryCard
                    key={entry.entryId}
                    entry={entry}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isEditing={editingEntryId === entry.entryId}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  };

  return renderContent();
};

export default JournalEntries;

