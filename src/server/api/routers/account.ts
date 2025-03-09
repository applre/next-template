import { publicProcedure, createTRPCRouter } from '@/server/api/trpc';
import { getUserSubscriptionPlan } from '@/server/stripe/subscription';

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
    const sub = await getUserSubscriptionPlan(session);
    return sub;
  }),
});
