import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faWrench, faSave } from '@fortawesome/free-solid-svg-icons';

const JournalEntries: React.FC = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const userId = useSelector((state: RootState) => state.session.user?.userId);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!userId) return; // Early return if userId is not available
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/journals/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEntries(response.data);
      } catch (error: any) {
        console.error('Error fetching journal entries:', error);
        setError('Failed to fetch journal entries.');
      }
    };
    fetchEntries();
  }, [userId]);

  const handleEdit = (entry: any) => {
    setEditingEntryId(entry._id);
    setEditForm({ ...entry }); // Set edit form to the current entry
  };

  const handleSave = async (entryId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/journals/${entryId}`, editForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEntries(entries.map((entry) => (entry._id === entryId ? { ...entry, ...editForm } : entry)));
      setEditingEntryId(null);
      setEditForm({});
    } catch (error) {
      console.error('Error saving entry:', error);
      setError('Failed to save entry.');
    }
  };

  const handleChange = (field: string, value: string) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleDelete = async (entryId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/journals/${entryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEntries(entries.filter((entry) => entry._id !== entryId));
    } catch (error) {
      console.error('Error deleting entry:', error);
      setError('Failed to delete entry.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Journal Entries</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {entries.length === 0 && !error && <p className="text-center">No journal entries found.</p>}
      <ul className="space-y-6 max-w-4xl mx-auto">
        {entries.map((entry) => (
          <li key={entry._id} className="p-6 bg-white border-2 border-gray-300 rounded-lg shadow-lg relative flex justify-between items-center">
            <div className="flex-grow">
              {editingEntryId === entry._id ? (
                <div className="space-y-4">
                  {Object.keys(editForm).map((key) => (
                    <div key={key} className="mb-2">
                      <label className="block font-semibold text-gray-600 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                      <input
                        type="text"
                        value={editForm[key] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                      />
                    </div>
                  ))}
                  <button onClick={() => handleSave(entry._id)} className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    <FontAwesomeIcon icon={faSave} /> Save
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold">{entry.tournamentName}</h3>
                  <p className="text-gray-600">Opponent: {entry.opponent}</p>
                  <p className="text-gray-600">Date: {entry.date}</p>
                  <p className="text-gray-600">Location: {entry.location}</p>
                  <p className="text-gray-600">Court Surface: {entry.courtSurface}</p>
                  <p className="text-gray-600">Strengths: {entry.strengths}</p>
                  <p className="text-gray-600">Weaknesses: {entry.weaknesses}</p>
                  <p className="text-gray-600">Lessons Learned: {entry.lessonsLearned}</p>
                </div>
              )}
            </div>
            <div className="ml-4 flex-shrink-0">
              {editingEntryId === entry._id ? (
                <button onClick={() => setEditingEntryId(null)} className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                  Cancel
                </button>
              ) : (
                <button onClick={() => handleEdit(entry)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                  <FontAwesomeIcon icon={faWrench} /> Edit
                </button>
              )}
              <button onClick={() => handleDelete(entry._id)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                <FontAwesomeIcon icon={faTrash} /> Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JournalEntries;
