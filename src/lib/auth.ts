import NextAuth from 'next-auth';
import type { DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import ResendProvider from 'next-auth/providers/resend';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { users, sessions, accounts, verificationTokens } from '@/server/db/schema/auth';
import { env } from '@/env.js';
import { EmailVerificationTemplate } from '@/components/emails/EmailVerification';
import { render } from '@react-email/render';

const translations = {
  en: {
    preview: 'Verify your email address to complete your {appTitle} registration',
    greeting: 'Hi,',
    message: 'We received a request to sign in to {host}. Click the button below to verify:',
    button: 'Verify Email Address',
    ignore: "If you didn't request this email, you can safely ignore it.",
    expiry: 'This link will expire in 24 hours',
  },
  zh: {
    preview: '验证您的邮箱地址以完成 {appTitle} 注册',
    greeting: '您好，',
    message: '我们收到了使用登录 {host} 的请求。请点击下面的按钮完成验证：',
    button: '验证邮箱地址',
    ignore: '如果您没有请求此邮件，请忽略它。',
    expiry: '此链接将在24小时后过期',
  },
} as const;

// Define custom session type
export type Session = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    stripeCustomerId?: string;
    isActive?: boolean;
  };
}

export const {
  handlers,
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  pages: {
    signIn: '/sign-in',
    verifyRequest: '/verify-email',
    error: '/error',
  },
  session: {
    strategy: 'jwt',
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as any, // Type cast needed for version mismatch
  providers: [
    AppleProvider({
      clientId: env.AUTH_APPLE_ID,
      clientSecret: env.AUTH_APPLE_SECRET,
    }),
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
    ResendProvider({
      apiKey: env.RESEND_API_KEY,
      from: env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier: to, url, provider }) => {
        const { host } = new URL(url);
        const locale = url.includes('/zh/') ? 'zh' : 'en';

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: provider.from,
            to,
            subject: locale === 'zh' ? `登录验证 ${host}` : `Verify login ${host}`,
            html: await render(
              EmailVerificationTemplate({
                url,
                host,
                translations: translations[locale],
              }),
            ),
            text: `Sign in to ${host}\n${url}\n\n`,
          }),
        });
      },
    }),
  ],
  events: {
    async linkAccount({ user }) {
      if (user.id) {
        await db.update(users).set({ emailVerified: new Date() }).where(eq(users.id, user.id));
      }
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});
