'use client';

import SignIn from './signIn';
import { redirect } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';

export default function SignInPage() {
  const { data: session } = useSession();
  const locale = useLocale();

  if (session?.user) {
    redirect({
      href: '/dashboard',
      locale,
    });
    return;
  }

  return <SignIn />;
}
