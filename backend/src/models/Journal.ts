import mongoose, { Document, Schema } from 'mongoose';

export interface IJournal extends Document {
  userId: mongoose.Types.ObjectId; 
  date: Date;
  opponent: string;
  tournamentName: string;
  location: string;
  courtSurface: string;
  strengths: string;
  weaknesses: string;
  lessonsLearned: string; 
}

const journalSchema = new Schema<IJournal>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  opponent: { type: String, required: true },
  tournamentName: { type: String, required: true },
  location: { type: String, required: true },
  courtSurface: { type: String, required: true },
  strengths: { type: String, required: true },
  weaknesses: { type: String, required: true },
  lessonsLearned: { type: String, required: true },
}, { timestamps: true });

const Journal = mongoose.model<IJournal>('Journal', journalSchema);
export default Journal;