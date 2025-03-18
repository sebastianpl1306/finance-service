import { Schema, model } from 'mongoose';
import { AuthenticationRoles, User } from '../../interfaces';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: AuthenticationRoles.CUSTOMER
  },
  city: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: false
  }
}, { timestamps: true })

export const UserModel = model<User>('User', UserSchema);