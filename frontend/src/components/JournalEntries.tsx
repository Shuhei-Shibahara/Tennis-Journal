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
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Journal Entries</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {entries.length === 0 && !error && <p className="text-center">No journal entries found.</p>}
      <ul className="space-y-6 max-w-4xl mx-auto">
        {entries.map((entry) => (
          <li key={entry._id} className="p-6 bg-white border-2 border-gray-300 rounded-lg shadow-lg relative overflow-hidden">
            <h3 className="text-2xl font-serif mb-4 text-purple-700 underline">{entry.tournamentName}</h3>
            <div className="absolute top-0 right-0 p-2 text-gray-400 text-sm italic">Journal Entry</div>
            <div className="space-y-2">
              <p><strong className="font-semibold">Date:</strong> {new Date(entry.date).toLocaleDateString()}</p>
              <p><strong className="font-semibold">Opponent:</strong> {entry.opponent}</p>
              <p><strong className="font-semibold">Location:</strong> {entry.location}</p>
              <p><strong className="font-semibold">Court Surface:</strong> {entry.courtSurface}</p>
              <div className="flex space-x-4">
                <div>
                  <p><strong className="font-semibold">Strengths:</strong></p>
                  <p className="italic bg-green-50 p-2 rounded-md">{entry.strengths}</p>
                </div>
                <div>
                  <p><strong className="font-semibold">Weaknesses:</strong></p>
                  <p className="italic bg-red-50 p-2 rounded-md">{entry.weaknesses}</p>
                </div>
              </div>
              <p><strong className="font-semibold">Lessons Learned:</strong></p>
              <p className="italic bg-yellow-50 p-2 rounded-md">{entry.lessonsLearned}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JournalEntries;
