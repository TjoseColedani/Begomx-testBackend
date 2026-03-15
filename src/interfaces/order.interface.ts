import { Types } from 'mongoose';
import { ITruck } from './truck.interface';
import { ILocation } from './location.interface';
import { IUser } from './user.interface';

export interface IOrder {
  user: Types.ObjectId | IUser;
  truck: Types.ObjectId | ITruck;
  status: 'created' | 'in_transit' | 'completed';
  pickup: Types.ObjectId | ILocation;
  dropoff: Types.ObjectId | ILocation;
}
