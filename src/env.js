import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url().min(1),

    RESEND_API_KEY: z.string().min(1),
    EMAIL_FROM: z.string().email().min(1),

    STRIPE_SECRET_KEY: z.string().startsWith('sk_').min(1),
    STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_').min(1),

    AUTH_GOOGLE_ID: z.string().min(1),
    AUTH_GOOGLE_SECRET: z.string().min(1),

    AUTH_APPLE_ID: z.string().min(1),
    AUTH_APPLE_SECRET: z.string().min(1),
    AUTH_SECRET: z.string().min(32),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url(),

    NEXT_PUBLIC_HIGHLIGHT_KEY: z.string().min(1),
    NEXT_PUBLIC_HIGHLIGHT_SERVICE_NAME: z.string().min(1),

    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_').min(1),
    NEXT_PUBLIC_STRIPE_FREE_PRICE_ID: z.string().startsWith('price_').min(1),
    NEXT_PUBLIC_STRIPE_PLUS_PRICE_ID: z.string().startsWith('price_').min(1),
    NEXT_PUBLIC_STRIPE_PRO_PRICE_ID: z.string().startsWith('price_').min(1),
  },
  shared: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  },
  experimental__runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,

    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,

    NEXT_PUBLIC_HIGHLIGHT_KEY: process.env.NEXT_PUBLIC_HIGHLIGHT_KEY,
    NEXT_PUBLIC_HIGHLIGHT_SERVICE_NAME: process.env.NEXT_PUBLIC_HIGHLIGHT_SERVICE_NAME,

    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_STRIPE_FREE_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_FREE_PRICE_ID,
    NEXT_PUBLIC_STRIPE_PLUS_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_PLUS_PRICE_ID,
    NEXT_PUBLIC_STRIPE_PRO_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,

    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,

    AUTH_APPLE_ID: process.env.AUTH_APPLE_ID,
    AUTH_APPLE_SECRET: process.env.AUTH_APPLE_SECRET,
    AUTH_SECRET: process.env.AUTH_SECRET,
  },
  skipValidation: process.env.NODE_ENV === 'development',
  emptyStringAsUndefined: true,
});
