import { Schema, model } from 'mongoose';
import { Intervals, MembershipPlan } from '../../interfaces';

const MembershipPlanSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  interval: {
    type: String,
    enum: Object.values(Intervals),
    required: true
  },
}, { timestamps: true })

export const MembershipPlanModel = model<MembershipPlan>('MembershipPlan', MembershipPlanSchema);