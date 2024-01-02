import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: { type: String, require: true, unique: true },
  username: { type: String, require: true },
  password: { type: String, require: true },
});

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}
