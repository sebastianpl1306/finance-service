import { Document } from 'mongoose';
import { User } from './User.interface';
import { TypesTransaction } from './Transaction.interfaces';

export interface Category extends Document {
    name: string;
    description?: string;
    color: string;
    type: TypesTransaction;
    user: User;
}