import { stripe } from '@/server/stripe/index';
import { env } from '@/env.js';
import { z } from 'zod';

const manageSubscriptionSchema = z.object({
  isSubscribed: z.boolean(),
  stripeCustomerId: z.string().nullable().optional(),
  isCurrentPlan: z.boolean(),
  stripePriceId: z.string(),
  email: z.string().email(),
  userId: z.string(),
});

type ManageStripeSubscriptionActionProps = z.infer<typeof manageSubscriptionSchema>;

export async function POST(req: Request) {
  const rawBody = await req.json();
  const body = manageSubscriptionSchema.parse(rawBody);
  const { isSubscribed, stripeCustomerId, userId, stripePriceId, email } = body;
  const billingUrl = `${env.NEXT_PUBLIC_APP_URL}/account/billing`;

  if (isSubscribed && stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: billingUrl,
    });

    return new Response(JSON.stringify({ url: stripeSession.url }), {
      status: 200,
    });
  }

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: billingUrl.concat('?success=true'),
    cancel_url: billingUrl,
    payment_method_types: ['card'],
    mode: 'subscription',
    billing_address_collection: 'auto',
    customer_email: email,
    line_items: [
      {
        price: stripePriceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
    },
  });

  return new Response(JSON.stringify({ url: stripeSession.url }), {
    status: 200,
  });
}
