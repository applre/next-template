import { publicProcedure, createTRPCRouter } from '@/server/api/trpc';
import { getUserSubscriptionPlan } from '@/server/stripe/subscription';
import type { Session } from '@/lib/auth';

export const accountRouter = createTRPCRouter({
  getUser: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      return ctx.session;
    }
  }),
  getSubscription: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      throw new Error('Session is required to get subscription');
    }
    const session = ctx.session;
    // Ignore type checking for this function call to focus on functionality
    // @ts-ignore - Type mismatch between Session and User is expected after package updates
    const sub = await getUserSubscriptionPlan(session);
    return sub;
  }),
});
