import Stripe from "stripe";
import { envs } from "../config";

export const stripe = new Stripe(envs.STRIPE_SECRET_KEY!);