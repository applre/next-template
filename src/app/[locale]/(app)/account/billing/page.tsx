import SuccessToast from './SuccessToast';
import { ManageUserSubscriptionButton } from './ManageSubscription';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { storeSubscriptionPlans } from '@/config/subscriptions';
import { getUserSubscriptionPlan } from '@/server/stripe/subscription';
import { CheckCircle2Icon } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getCurrentUser } from '@/lib/session';

export default async function Billing() {
  const user = await getCurrentUser();

  const subscriptionPlan = await getUserSubscriptionPlan(user || undefined);

  return (
    <div className="min-h-[calc(100vh-57px)] ">
      <SuccessToast />
      <Link href="/account">
        <Button variant={'link'} className="px-0">
          Back
        </Button>
      </Link>
      <h1 className="mb-4 font-semibold text-3xl">Billing</h1>
      <Card className="mb-2 p-6">
        <h3 className="font-bold text-muted-foreground text-xs uppercase">Subscription Details</h3>
        <p className="my-2 font-semibold text-lg leading-none">{subscriptionPlan.name}</p>
        <p className="text-muted-foreground text-sm">
          {!subscriptionPlan.isSubscribed
            ? 'You are not subscribed to any plan.'
            : subscriptionPlan.isCanceled
              ? 'Your plan will be canceled on '
              : 'Your plan renews on '}
          {subscriptionPlan?.stripeCurrentPeriodEnd
            ? subscriptionPlan.stripeCurrentPeriodEnd.toLocaleDateString()
            : null}
        </p>
      </Card>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {storeSubscriptionPlans.map((plan) => (
          <Card
            key={plan.id}
            className={plan.name === subscriptionPlan.name ? 'border-primary' : ''}
          >
            {plan.name === subscriptionPlan.name ? (
              <div className="relative w-full">
                <div className="absolute right-0 w-fit rounded-t-none rounded-l-lg bg-secondary-foreground px-3 py-1 text-center font-semibold text-secondary text-xs">
                  Current Plan
                </div>
              </div>
            ) : null}
            <CardHeader className="mt-2">
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-2 mb-8">
                <h3 className="font-bold">
                  <span className="text-3xl">${plan.price / 100}</span> / month
                </h3>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={`feature_${i + 1}`} className="flex gap-x-2 text-sm">
                    <CheckCircle2Icon className="h-5 w-5 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex items-end justify-center">
              {user?.email ? (
                <ManageUserSubscriptionButton
                  userId={user.id}
                  email={user.email || ''}
                  stripePriceId={plan.stripePriceId}
                  stripeCustomerId={subscriptionPlan?.stripeCustomerId}
                  isSubscribed={!!subscriptionPlan.isSubscribed}
                  isCurrentPlan={subscriptionPlan?.name === plan.name}
                />
              ) : (
                <div>
                  <Link href="/account">
                    <Button className="text-center" variant="ghost">
                      Add Email to Subscribe
                    </Button>
                  </Link>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
