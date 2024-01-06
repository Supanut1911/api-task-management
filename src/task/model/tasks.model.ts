import * as mongoose from 'mongoose';

export const TaskSchema = new mongoose.Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  creator: { type: mongoose.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
});

export interface Task extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  status: boolean;
  creator: string;
}
