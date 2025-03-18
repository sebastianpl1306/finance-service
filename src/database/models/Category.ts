import { Schema, Types, model } from 'mongoose';
import { Category } from '../../interfaces';

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true })

export const CategoryModel = model<Category>('Category', CategorySchema);