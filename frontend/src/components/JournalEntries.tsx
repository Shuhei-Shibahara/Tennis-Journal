import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const JournalEntries: React.FC = () => {
  const [entries, setEntries] = useState<any[]>([]); 
  const [error, setError] = useState('');
  const userId = useSelector((state: RootState) => state.session.user?._id); 

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        if (userId) {
          const token = localStorage.getItem('token'); 
          const response = await axios.get(`http://localhost:5000/api/journals/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          });
          setEntries(response.data);
        }
      } catch (error: any) {
        console.error('Error fetching journal entries:', error);
        setError('Failed to fetch journal entries.');
      }
    };
    fetchEntries();
  }, [userId]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Journal Entries</h2>
      {error && <p className="text-red-500">{error}</p>}
      {entries.length === 0 && !error && <p>No journal entries found.</p>}
      <ul className="space-y-2">
        {entries.map((entry) => (
          <li key={entry._id} className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold">{entry.tournamentName}</h3>
            <p><strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}</p>
            <p><strong>Opponent:</strong> {entry.opponent}</p>
            <p><strong>Location:</strong> {entry.location}</p>
            <p><strong>Court Surface:</strong> {entry.courtSurface}</p>
            <p><strong>Strengths:</strong> {entry.strengths}</p>
            <p><strong>Weaknesses:</strong> {entry.weaknesses}</p>
            <p><strong>Lessons Learned:</strong> {entry.lessonsLearned}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JournalEntries;
