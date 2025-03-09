import { pgTable, primaryKey, timestamp, varchar, index } from 'drizzle-orm/pg-core';

export const subscriptions = pgTable(
  'subscriptions',
  {
    userId: varchar('user_id', { length: 255 }).unique(),
    stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).unique(),
    stripeSubscriptionId: varchar('stripe_subscription_id', {
      length: 255,
    }).unique(),
    stripePriceId: varchar('stripe_price_id', { length: 255 }),
    stripeCurrentPeriodEnd: timestamp('stripe_current_period_end'),
  },
  (table) => ({
    userIdx: index('subscription_user_idx').on(table.userId),
    pk: primaryKey({ columns: [table.userId, table.stripeCustomerId] }),
  }),
);

// import { pgTable, primaryKey, timestamp, varchar, index } from 'drizzle-orm/pg-core';
// import { relations } from 'drizzle-orm';
// import { users } from './auth';

// export const subscriptions = pgTable(
//   'subscriptions',
//   {
//     userId: varchar('user_id', { length: 255 })
//       .notNull()
//       .references(() => users.id, { onDelete: 'cascade' })
//       .unique(),
//     stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).unique(),
//     stripeSubscriptionId: varchar('stripe_subscription_id', {
//       length: 255,
//     }).unique(),
//     stripePriceId: varchar('stripe_price_id', { length: 255 }),
//     stripeCurrentPeriodEnd: timestamp('stripe_current_period_end'),
//   },
//   (table) => ({
//     userIdx: index('subscription_user_idx').on(table.userId),
//     customerIdx: index('subscription_customer_idx').on(table.stripeCustomerId),
//     subscriptionIdx: index('subscription_subscription_idx').on(table.stripeSubscriptionId),
//     pk: primaryKey({ columns: [table.userId] }),
//   }),
// );

// export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
//   user: one(users, {
//     fields: [subscriptions.userId],
//     references: [users.id],
//   }),
// }));

// // Add the reverse relation to users
// export const usersToSubscriptionsRelations = relations(users, ({ one }) => ({
//   subscription: one(subscriptions, {
//     fields: [users.id],
//     references: [subscriptions.userId],
//   }),
// }));
