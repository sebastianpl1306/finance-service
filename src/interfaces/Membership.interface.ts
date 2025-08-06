import { Document } from 'mongoose';
import { User } from './User.interface';

export interface MembershipPlan extends Document {
    name: string;
    price: number;
    interval: Intervals;
}

export interface UserMembership extends Document {
  user: User;
  plan: MembershipPlan;
  planId: string;
  mercadoPagoSubscriptionId?: string;
  status: MembershipStatus;
  amount: number;
  frequency: Intervals;
  startDate: Date;
  nextPaymentDate?: Date;
  isActive: boolean;
}

export enum Intervals {
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export enum MembershipStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PAUSED = 'paused',
  COMPLETE = 'complete',
}

export enum MembershipStatusInvoice {
  PAID = 'paid',
  UNPAID = 'unpaid',
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed'
}

export interface CreateSubscriptionRequest {
  userId: string;
  email: string;
  planId: string;
  amount: number;
  frequency: Intervals;
  cardToken?: string;
}