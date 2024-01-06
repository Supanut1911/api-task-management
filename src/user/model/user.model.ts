import * as mongoose from 'mongoose';
import { Task } from 'src/task/model/tasks.model';

export const UserSchema = new mongoose.Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  tasks: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Task',
      require: true,
    },
  ],
});

export interface User {
  id: string;
  username: string;
  password: string;
  tasks: Task[];
}
