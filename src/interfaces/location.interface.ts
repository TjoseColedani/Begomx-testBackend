import { Types } from 'mongoose';
import { IUser } from './user.interface';

export interface ILocation {
  user: Types.ObjectId | IUser;
  address: string;
  place_id: string;
  latitude: number;
  longitude: number;
}
