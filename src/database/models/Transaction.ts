import { Schema, Types, model } from 'mongoose';
import { Transaction, TypesTransaction } from '../../interfaces';

const TransactionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  value: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: Object.values(TypesTransaction),
    required: true
  },
  category: {
    type: Types.ObjectId,
    ref: 'Category',
    required: true
  },
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

export const TransactionModel = model<Transaction>('Transaction', TransactionSchema);