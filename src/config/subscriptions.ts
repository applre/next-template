export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  stripePriceId: string;
  price: number;
  features: Array<string>;
}

export const storeSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'You can create up to 3 Projects. Upgrade to the PRO plan for unlimited projects.',
    price: 0,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_FREE_PRICE_ID ?? '',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
  {
    id: 'plus',
    name: 'Plus',
    description: 'Unlimited AI and custom branding to elevate your workflow.',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PLUS_PRICE_ID ?? '',
    price: 8,
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Pro tier that offers x, y, and z features.',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? '',
    price: 15,
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
];
