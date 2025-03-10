'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { env } from '@/env.js';

if (typeof window !== 'undefined') {
  const posthogKey = env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = env.NEXT_PUBLIC_POSTHOG_HOST;

  if (posthogKey && posthogHost) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
    });
  } else {
    console.warn('PostHog initialization failed: Missing key or host');
  }
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
