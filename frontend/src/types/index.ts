export interface User {
  userId: string;
  email: string;
}

export interface JournalEntry {
  entryId: string;
  userId: string;
  date: string;
  opponent: string;
  tournamentName: string;
  location: string;
  courtSurface: string;
  strengths: string[];
  weaknesses: string[];
  lessonsLearned: string;
  stats?: string;
  result?: 'Win' | 'Lose';
  score?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {} 