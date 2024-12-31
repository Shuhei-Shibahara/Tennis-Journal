import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faWrench, faChartBar } from '@fortawesome/free-solid-svg-icons';
import Button from './Button';
import StatsDisplay from './StatsDisplay';
import { JournalEntry } from '../../types';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (entryId: string) => void;
  isEditing?: boolean;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({
  entry,
  onEdit,
  onDelete,
  isEditing = false,
}) => {
  const [showStats, setShowStats] = useState(false);
  const stats = typeof entry.stats === 'string' ? JSON.parse(entry.stats) : entry.stats;

  const handleDelete = async () => {
    if (!entry.entryId) {
      console.error('No entry ID available');
      return;
    }

    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        console.log('Attempting to delete entry:', entry.entryId); // Debug log
        await onDelete(entry.entryId);
      } catch (error) {
        console.error('Failed to delete entry:', error);
      }
    }
  };

  return (
    <li className="p-6 bg-white border-2 border-gray-300 rounded-lg shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold">{entry.tournamentName}</h3>
          <p className="text-gray-600">Opponent: {entry.opponent}</p>
          <p className="text-gray-600">Date: {entry.date}</p>
          <p className="text-gray-600">Result: {entry.result}</p>
          <p className="text-gray-600">Score: {entry.score}</p>
          <p className="text-gray-600">Location: {entry.location}</p>
          <p className="text-gray-600">Court Surface: {entry.courtSurface}</p>
          <p className="text-gray-600">Strengths: {entry.strengths.join(', ')}</p>
          <p className="text-gray-600">Weaknesses: {entry.weaknesses.join(', ')}</p>
          <p className="text-gray-600">Lessons Learned: {entry.lessonsLearned}</p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => onEdit(entry)}
            disabled={isEditing}
          >
            <FontAwesomeIcon icon={faWrench} /> Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={isEditing}
          >
            <FontAwesomeIcon icon={faTrash} /> Delete
          </Button>
          {stats && stats.length > 0 && (
            <Button
              variant="primary"
              onClick={() => setShowStats(!showStats)}
            >
              <FontAwesomeIcon icon={faChartBar} /> {showStats ? 'Hide Stats' : 'Show Stats'}
            </Button>
          )}
        </div>
      </div>

      {showStats && stats && stats.length > 0 && (
        <StatsDisplay stats={stats} result={entry.result as 'Win' | 'Lose'} />
      )}
    </li>
  );
};

export default JournalEntryCard; 