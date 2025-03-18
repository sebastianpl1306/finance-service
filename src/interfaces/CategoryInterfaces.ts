import { Document } from 'mongoose';
import { User } from './User.interface';

export interface Category extends Document {
    name: string;
    description?: string;
    user: User
}