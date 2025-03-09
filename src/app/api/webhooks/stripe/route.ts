import { db } from '@/server/db/index';
import { stripe } from '@/server/stripe/index';
import { headers } from 'next/headers';
import type Stripe from 'stripe';
import { subscriptions } from '@/server/db/schema/subscriptions';
import { eq } from 'drizzle-orm';
import { env } from '@/env.js';

// Define supported webhook event types
type WebhookEvent = 'checkout.session.completed' | 'invoice.payment_succeeded';

// Handle subscription updates
async function updateSubscriptionData(data: {
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: Date;
  userId?: string;
}) {
  const { userId, stripeCustomerId, ...updateData } = data;

  if (userId) {
    const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));

    if (sub) {
      await db.update(subscriptions).set(updateData).where(eq(subscriptions.userId, userId));
    } else {
      await db.insert(subscriptions).values({ ...data });
    }
  } else if (stripeCustomerId) {
    await db
      .update(subscriptions)
      .set(updateData)
      .where(eq(subscriptions.stripeCustomerId, stripeCustomerId));
  }
}

// Handle checkout session completion
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    await updateSubscriptionData({
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      userId: session.metadata?.userId,
    });
  } catch (error) {
    console.error('Error handling checkout session:', error);
    throw error;
  }
}

// Handle invoice payment success
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    if (invoice.billing_reason === 'subscription_create') {
      return; // Skip initial subscription creation
    }

    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);

    await db
      .update(subscriptions)
      .set({
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      })
      .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
  } catch (error) {
    console.error('Error handling invoice payment:', error);
    throw error;
  }
}

// Webhook event handlers map
const eventHandlers: Record<WebhookEvent, (event: Stripe.Event) => Promise<void>> = {
  'checkout.session.completed': async (event) => {
    await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
  },
  'invoice.payment_succeeded': async (event) => {
    await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = (await headers()).get('Stripe-Signature') ?? '';

    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    if (!env.STRIPE_WEBHOOK_SECRET) {
      return new Response('Webhook secret not configured', { status: 500 });
    }

    const event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);

    // Type guard for supported events
    if (event.type in eventHandlers) {
      await eventHandlers[event.type as WebhookEvent](event);
      return new Response(null, { status: 200 });
    }

    // Unhandled event type
    console.log(`Unhandled event type: ${event.type}`);
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      `Webhook Error: ${error instanceof Error ? error.message : 'Unknown Error'}`,
      { status: 400 },
    );
  }
}
