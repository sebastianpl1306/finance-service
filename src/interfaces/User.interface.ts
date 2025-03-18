import { Document } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: AuthenticationRoles;
  city?: string;
  country?: string;
}

export enum AuthenticationRoles {
  CUSTOMER = 'customer',
  ADMIN = 'admin'
}