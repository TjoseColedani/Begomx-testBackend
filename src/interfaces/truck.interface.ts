import { Types } from 'mongoose';
import { IUser } from './user.interface';

export interface ITruck {
  user: Types.ObjectId | IUser;
  year: string;
  color: string;
  plates: string;
}
