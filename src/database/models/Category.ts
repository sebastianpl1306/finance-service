import { Schema, Types, model } from 'mongoose';
import { Category, TypesTransaction } from '../../interfaces';

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  color: {
    type: String,
    default: '#ffffff'
  },
  type: {
    type: String,
    enum: Object.values(TypesTransaction),
    required: true
  },
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true })

export const CategoryModel = model<Category>('Category', CategorySchema);