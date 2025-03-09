import '@/styles/globals.css';

import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/ThemeProvider';
import { CSPostHogProvider } from '@/components/PostHogProvider';
import { HighlightProvider } from '@/components/HighlightProvider';
import { SessionProvider } from '@/components/SessionProvider';
import TRPCProvider from '@/server/trpc/react';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

type Locale = (typeof routing.locales)[number];

export const metadata: Metadata = {
  title: 'Landing Page',
};

type Props = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function LocaleLayout({ children, params }: Props) {
  // Await the params
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <>
      <HighlightProvider />
      <html suppressHydrationWarning lang={locale}>
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            GeistSans.variable,
            GeistMono.variable,
          )}
        >
          <NextIntlClientProvider messages={messages} locale={locale}>
            <TRPCProvider>
              <SessionProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <CSPostHogProvider>{children}</CSPostHogProvider>
                </ThemeProvider>
              </SessionProvider>
            </TRPCProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </>
  );
}
