import * as mongoose from 'mongoose';

export const TaskSchema = new mongoose.Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  status: { type: Boolean, default: false },
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
});

export interface Task extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  status: boolean;
}
