'use server';

import { verifyEmailTokenSchema, verifyOAuthSchema } from '@/server/validators/auth';
import { Paths } from '@/lib/constants';
import { signIn, signOut } from '@/lib/auth';
import { db } from '@/server/db';
import { users, verificationTokens } from '@/server/db/schema/auth';
import { createServerActionProcedure } from 'zsa';
import { getUserByEmail } from '@/server/data/auth';
import { eq, and } from 'drizzle-orm';
import { checkEmailVerificationLimits } from './utils';
import {
  handleAuthError,
  AUTH_MESSAGES,
  AuthActionError,
  AuthErrorType,
} from '@/server/error/auth';

interface AuthActionResponse {
  success?: boolean;
  error?: string;
  message?: string;
  token?: string;
}

export const verifyEmailTokenAction = createServerActionProcedure()
  .handler(async (): Promise<AuthActionResponse> => {
    return { token: undefined };
  })
  .createServerAction()
  .input(verifyEmailTokenSchema)
  .handler(async (input) => {
    const { email } = input.input;

    try {
      // await checkEmailVerificationLimits(email);

      const existingUser = await getUserByEmail(email);

      // If the user exists and the email address has been verified,
      // but the session has expired, send a login link.
      if (existingUser?.emailVerified) {
        await signIn('resend', {
          email,
          redirect: false,
          redirectTo: Paths.Dashboard,
        });

        return {
          success: true,
          message: AUTH_MESSAGES.LOGIN_LINK_SENT,
        };
      }

      // If the user does not exist or the email address is not verified,
      // create a new user and send a verification link
      if (!existingUser) {
        await db.insert(users).values({
          email,
          emailVerified: null,
        });
      }

      await signIn('resend', {
        email,
        redirectTo: Paths.Dashboard,
      });

      return { success: true };
    } catch (error) {
      const result = handleAuthError(error);
      return { success: false, ...result };
    }
  });

export const verifyOAuthAction = createServerActionProcedure()
  .handler(async (): Promise<AuthActionResponse> => {
    return { token: undefined };
  })
  .createServerAction()
  .input(verifyOAuthSchema)
  .handler(async (input) => {
    const { type } = input.input;

    try {
      await signIn(type, {
        redirect: false,
        redirectTo: Paths.Dashboard,
      });
      return { success: true };
    } catch (error) {
      const result = handleAuthError(error);
      return { success: false, ...result };
    }
  });

export const signOutAction = createServerActionProcedure()
  .handler(async (): Promise<AuthActionResponse> => {
    return { token: undefined };
  })
  .createServerAction()
  .handler(async () => {
    try {
      await signOut({
        redirectTo: Paths.Home,
      });
      return { success: true };
    } catch (error) {
      const result = handleAuthError(error);
      return { success: false, ...result };
    }
  });

// 用于验证 token 的辅助函数
export async function verifyToken(token: string, identifier: string) {
  try {
    await db.transaction(async (tx) => {
      // Verify the token exist
      const [verificationToken] = await tx
        .select()
        .from(verificationTokens)
        .where(
          and(eq(verificationTokens.identifier, identifier), eq(verificationTokens.token, token)),
        );

      if (!verificationToken || new Date(verificationToken.expires) < new Date()) {
        throw new AuthActionError(AuthErrorType.INVALID_TOKEN, AUTH_MESSAGES.INVALID_TOKEN);
      }

      // Delete the token
      await tx
        .delete(verificationTokens)
        .where(eq(verificationTokens.identifier, verificationToken.identifier));

      // Update user vertifiy status
      const [user] = await tx
        .update(users)
        .set({
          emailVerified: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(users.email, identifier))
        .returning();

      if (!user) {
        throw new AuthActionError(AuthErrorType.USER_NOT_FOUND, AUTH_MESSAGES.USER_NOT_FOUND);
      }

      return token;
    });

    return { success: true };
  } catch (error) {
    const result = handleAuthError(error);
    return { success: false, ...result };
  }
}
