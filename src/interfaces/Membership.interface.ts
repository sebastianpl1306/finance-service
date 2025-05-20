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
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    status: MembershipStatus;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
}

export enum Intervals {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  LIFETIME = 'lifetime'
}

export enum MembershipStatus {
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
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