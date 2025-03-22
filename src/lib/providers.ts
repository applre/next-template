import { env } from '@/env';
import { createToken } from './paseto';
import { db } from '@/server/db';
import { users, accounts, verificationTokens } from '@/server/db/schema/auth';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// Simplified email template for now
interface EmailTemplateProps {
  url: string;
  host: string;
  translations: {
    preview: string;
    greeting: string;
    message: string;
    button: string;
    ignore: string;
    expiry: string;
  };
}

function renderEmailTemplate({ url, host, translations }: EmailTemplateProps): string {
  return `
    <html>
      <body>
        <h1>Brightopia</h1>
        <p>${translations.greeting}</p>
        <p>${translations.message.replace('{host}', host)}</p>
        <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px;">
          ${translations.button}
        </a>
        <p>${translations.ignore}</p>
        <hr style="margin: 20px 0; border: 1px solid #eee;" />
        <p style="color: #666; font-size: 14px;">${translations.expiry}</p>
      </body>
    </html>
  `;
}

export interface AuthProviderOptions {
  email?: string;
  redirectTo?: string;
  callbackUrl?: string;
  redirect?: boolean;
}

// Abstract base provider
export interface UserData {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
  stripeCustomerId?: string;
  isActive?: boolean;
}

export abstract class AuthProvider {
  abstract type: string;
  abstract signIn(
    options?: AuthProviderOptions,
  ): Promise<{ success: boolean; url?: string; error?: string }>;
  abstract callback(
    params: Record<string, string>,
  ): Promise<{ user: UserData; token: string } | null>;
}

// Google OAuth provider
export class GoogleProvider extends AuthProvider {
  type = 'google';
  clientId = env.AUTH_GOOGLE_ID;
  clientSecret = env.AUTH_GOOGLE_SECRET;

  async signIn(
    options?: AuthProviderOptions,
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    // Generate state for CSRF protection
    const state = nanoid();
    const redirectUri = `${env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`;

    // Build OAuth URL
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.append('client_id', this.clientId);
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', 'email profile');
    url.searchParams.append('state', state);

    // Store state in session/cookie for validation during callback
    // This would require a separate mechanism, simplified here

    if (options?.redirect === false) {
      return { success: true, url: url.toString() };
    }

    // Redirect to the OAuth URL
    return { success: true, url: url.toString() };
  }

  async callback(
    params: Record<string, string>,
  ): Promise<{ user: UserData; token: string } | null> {
    const { code, state } = params;

    if (!code) {
      return null;
    }

    try {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
          grant_type: 'authorization_code',
        }),
      });

      // Get user profile
      const tokens = (await tokenResponse.json()) as {
        access_token: string;
        id_token: string;
        expires_in: number;
      };

      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      const profile = (await profileResponse.json()) as {
        id: string;
        email: string;
        name: string;
        picture: string;
      };

      // Find or create user
      // Note: In a real implementation, we would use prepared queries
      // This is simplified for the example
      const existingUsers = await db.select().from(users).where(eq(users.email, profile.email));
      let user = existingUsers[0];

      if (!user) {
        // Create new user
        const result = await db
          .insert(users)
          .values({
            email: profile.email,
            name: profile.name,
            image: profile.picture,
            emailVerified: new Date(),
          })
          .returning();
        user = result[0];
      } else if (!user.emailVerified) {
        // Update email verification status
        await db
          .update(users)
          .set({ emailVerified: new Date(), name: profile.name, image: profile.picture })
          .where(eq(users.id, user.id));
      }

      // Store account connection
      await db
        .insert(accounts)
        .values({
          userId: user.id,
          type: 'oauth',
          provider: 'google',
          providerAccountId: profile.id,
          access_token: tokens.access_token,
          id_token: tokens.id_token,
          expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
          scope: 'email profile',
        })
        .onConflictDoUpdate({
          target: [accounts.provider, accounts.providerAccountId],
          set: {
            access_token: tokens.access_token,
            id_token: tokens.id_token,
            expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
          },
        });

      // Create PASETO token
      const token = await createToken({
        sub: user.id,
        email: user.email,
        name: user.name,
        picture: user.image,
      });

      return { user, token };
    } catch (error) {
      console.error('Google OAuth error:', error);
      return null;
    }
  }
}

// Apple Sign-In provider
export class AppleProvider extends AuthProvider {
  type = 'apple';
  clientId = env.AUTH_APPLE_ID;
  clientSecret = env.AUTH_APPLE_SECRET;

  // Implementation similar to GoogleProvider but for Apple Sign-In
  async signIn(
    options?: AuthProviderOptions,
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    // Similar to Google but with Apple-specific parameters
    const state = nanoid();
    const redirectUri = `${env.NEXT_PUBLIC_APP_URL}/api/auth/callback/apple`;

    const url = new URL('https://appleid.apple.com/auth/authorize');
    url.searchParams.append('client_id', this.clientId);
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', 'name email');
    url.searchParams.append('response_mode', 'form_post');
    url.searchParams.append('state', state);

    if (options?.redirect === false) {
      return { success: true, url: url.toString() };
    }

    return { success: true, url: url.toString() };
  }

  async callback(
    params: Record<string, string>,
  ): Promise<{ user: UserData; token: string } | null> {
    // Apple-specific callback implementation
    // This would require handling Apple's specific JWT responses
    // Simplified for brevity - in a real implementation, this would be more complex
    const { code } = params;

    if (!code) {
      return null;
    }

    try {
      // In a real implementation, this would exchange the code for tokens
      // and validate the identity token from Apple

      // For now, we'll just create a mock user
      const mockUser = {
        id: nanoid(),
        email: 'apple-user@example.com',
        name: 'Apple User',
      };

      // Create PASETO token
      const token = await createToken({
        sub: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      });

      return { user: mockUser, token };
    } catch (error) {
      console.error('Apple Sign-In error:', error);
      return null;
    }
  }
}

// Email verification provider (similar to Resend in NextAuth)
export class EmailProvider extends AuthProvider {
  type = 'email';
  apiKey = env.RESEND_API_KEY;
  from = env.EMAIL_FROM;

  async signIn(
    options?: AuthProviderOptions,
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    const { email, redirectTo } = options || {};

    if (!email) {
      return { success: false, error: 'Email is required' };
    }

    try {
      // Create verification token
      const token = nanoid(32);
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Store token in database
      await db.insert(verificationTokens).values({
        token,
        identifier: email,
        expires,
      });

      // Generate verification URL
      const verifyUrl = new URL('/verify-email', env.NEXT_PUBLIC_APP_URL);
      verifyUrl.searchParams.append('token', token);
      verifyUrl.searchParams.append('email', email);

      if (redirectTo) {
        verifyUrl.searchParams.append('callbackUrl', redirectTo);
      }

      // Send email
      const host = new URL(env.NEXT_PUBLIC_APP_URL).hostname;
      const locale = options?.callbackUrl?.includes('/zh/') ? 'zh' : 'en';

      const translations = {
        en: {
          preview: 'Sign in to your account',
          greeting: 'Hello,',
          message: 'Click the link below to sign in to your account at {host}.',
          button: 'Sign in',
          ignore: 'If you did not request this email, you can safely ignore it.',
          expiry: 'This link expires in 24 hours.',
        },
        zh: {
          preview: '登录到您的账户',
          greeting: '您好，',
          message: '点击下面的链接登录到您在 {host} 的账户。',
          button: '登录',
          ignore: '如果您没有请求此电子邮件，可以安全地忽略它。',
          expiry: '此链接将在24小时后过期。',
        },
      };

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.from,
          to: email,
          subject: locale === 'zh' ? `登录验证 ${host}` : `Verify login ${host}`,
          html: renderEmailTemplate({
            url: verifyUrl.toString(),
            host,
            translations: translations[locale as keyof typeof translations],
          }),
          text: `Sign in to ${host}\n${verifyUrl.toString()}\n\n`,
        }),
      });

      return { success: true };
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, error: 'Failed to send verification email' };
    }
  }

  async callback(
    params: Record<string, string>,
  ): Promise<{ user: UserData; token: string } | null> {
    const { token, email } = params;

    if (!token || !email) {
      return null;
    }

    try {
      // Verify token
      const [verificationToken] = await db
        .select()
        .from(verificationTokens)
        .where(and(eq(verificationTokens.identifier, email), eq(verificationTokens.token, token)));

      if (!verificationToken || new Date(verificationToken.expires) < new Date()) {
        return null;
      }

      // Delete token
      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.identifier, verificationToken.identifier));

      // Find or create user
      const existingUsers = await db.select().from(users).where(eq(users.email, email));
      let user = existingUsers[0];

      if (!user) {
        // Create user
        const result = await db
          .insert(users)
          .values({
            email,
            emailVerified: new Date(),
          })
          .returning();
        user = result[0];
      } else {
        // Update email verification
        await db.update(users).set({ emailVerified: new Date() }).where(eq(users.id, user.id));
      }

      // Create PASETO token
      const pasetoToken = await createToken({
        sub: user.id,
        email: user.email,
        name: user.name,
        picture: user.image,
      });

      return { user, token: pasetoToken };
    } catch (error) {
      console.error('Email verification callback error:', error);
      return null;
    }
  }
}

// Provider factory
export function getProvider(type: string): AuthProvider {
  switch (type) {
    case 'google':
      return new GoogleProvider();
    case 'apple':
      return new AppleProvider();
    case 'email':
    case 'resend':
      return new EmailProvider();
    default:
      throw new Error(`Unsupported provider: ${type}`);
  }
}
