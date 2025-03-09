import Stripe from 'stripe';
import { env } from '@/env.js';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2025-02-24.acacia' as Stripe.StripeConfig['apiVersion'], // Type cast to match expected version
  typescript: true,
});
