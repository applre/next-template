import { AccountCard, AccountCardBody, AccountCardFooter } from './AccountCard';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { getUserSubscriptionPlan } from '@/server/stripe/subscription';
import { getCurrentUser } from '@/lib/session';

interface PlanSettingsProps {
  stripeSubscriptionId: string | null;
  stripeCurrentPeriodEnd: Date | null;
  stripeCustomerId: string | null;
  isSubscribed: boolean | '' | null;
  isCanceled: boolean;
  id?: string | undefined;
  name?: string | undefined;
  description?: string | undefined;
  stripePriceId?: string | undefined;
  price?: number | undefined;
}

export default async function PlanSettings() {
  const user = await getCurrentUser();

  const subscriptionPlan = await getUserSubscriptionPlan(user);

  return (
    <AccountCard
      params={{
        header: 'Your Plan',
        description: subscriptionPlan.isSubscribed
          ? `You are currently on the ${subscriptionPlan.name} plan.`
          : `You are not subscribed to any plan.`.concat(
              !user?.name || user?.name.length < 5
                ? ' Please add your email to upgrade your account.'
                : '',
            ),
      }}
    >
      <AccountCardBody>
        {subscriptionPlan.isSubscribed ? (
          <h3 className="font-semibold text-lg">
            ${subscriptionPlan.price ? subscriptionPlan.price / 100 : 0} / month
          </h3>
        ) : null}
        {subscriptionPlan.stripeCurrentPeriodEnd ? (
          <p className="mb-4 text-muted-foreground text-sm ">
            Your plan will{' '}
            {!subscriptionPlan.isSubscribed
              ? null
              : subscriptionPlan.isCanceled
                ? 'cancel'
                : 'renew'}
            {' on '}
            <span className="font-semibold">
              {subscriptionPlan.stripeCurrentPeriodEnd.toLocaleDateString('en-us')}
            </span>
          </p>
        ) : null}
      </AccountCardBody>
      <AccountCardFooter description="Manage your subscription on Stripe.">
        <Link href="/account/billing">
          <Button variant="outline">Go to billing</Button>
        </Link>
      </AccountCardFooter>
    </AccountCard>
  );
}
