import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the User model
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

// Create the schema for the User model
const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create the User model
const User = mongoose.model<IUser>('User', UserSchema);

export default User;