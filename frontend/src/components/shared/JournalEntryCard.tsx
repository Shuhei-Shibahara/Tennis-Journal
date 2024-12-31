import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faWrench } from '@fortawesome/free-solid-svg-icons';
import Button from './Button';
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
  return (
    <li className="p-6 bg-white border-2 border-gray-300 rounded-lg shadow-lg relative flex justify-between items-center">
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
        <p className="text-gray-600">
          Stats: {typeof entry.stats === 'object' ? JSON.stringify(entry.stats) : entry.stats}
        </p>
      </div>
      <div className="ml-4 flex-shrink-0 space-x-2">
        <Button
          variant="secondary"
          onClick={() => onEdit(entry)}
          disabled={isEditing}
        >
          <FontAwesomeIcon icon={faWrench} /> Edit
        </Button>
        <Button
          variant="danger"
          onClick={() => onDelete(entry.entryId)}
          disabled={isEditing}
        >
          <FontAwesomeIcon icon={faTrash} /> Delete
        </Button>
      </div>
    </li>
  );
};

export default JournalEntryCard; 