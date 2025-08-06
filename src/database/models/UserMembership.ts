import { Schema, Types, model } from 'mongoose';
import { Intervals, MembershipStatus, UserMembership } from '../../interfaces';

const UserMembershipSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  planId: {
    type: String,
    required: true
  },
  mercadoPagoSubscriptionId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(MembershipStatus),
    default: MembershipStatus.PENDING
  },
  amount: {
    type: Number,
    required: true
  },
  frequency: {
    type: String,
    enum: Object.values(Intervals),
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  nextPaymentDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

export const UserMembershipModel = model<UserMembership>('UserMembership', UserMembershipSchema);