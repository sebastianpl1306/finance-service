import { Schema, Types, model } from 'mongoose';
import { MembershipStatus, UserMembership } from '../../interfaces';

const UserMembershipSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: Types.ObjectId,
    ref: 'MembershipPlan',
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: Object.values(MembershipStatus),
    default: MembershipStatus.INCOMPLETE
  },
  stripeCustomerId: {
    type: String,
    required: false
  },
  stripeSubscriptionId: {
    type: String,
    required: false
  },
}, { timestamps: true })

export const UserMembershipModel = model<UserMembership>('UserMembership', UserMembershipSchema);