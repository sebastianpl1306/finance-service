import { Document } from 'mongoose';
import { Category } from './CategoryInterfaces';
import { User } from './User.interface';

export interface Transaction extends Document {
    name: string;
    description?: string;
    value: number;
    category: Category;
    type: TypesTransaction;
    date: Date;
    user: User
}

export enum TypesTransaction {
    INCOME = 'income',
    EXPENSE = 'expense'
}

export interface TransactionFilters {
    textSearch?: string | null;
    startDate?: Date | null;
    finishDate?: Date | null;
    categories?: string[] | null;
    type?: TypesTransaction;
}

export interface QueryFiltersTransaction {
    $or?: Array<{ name: { $regex: RegExp; }; } | { description: { $regex: RegExp; }; }>;
    categories?: { $in: string[] };
    date?: { $gte: Date, $lte: Date };
    type?: TypesTransaction;
    // isDelete?: boolean;
}