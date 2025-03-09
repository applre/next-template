import { getTokenByEmail } from '@/server/data/auth';
import { RateLimiter } from '@/lib/limiter';
import { AUTH_MESSAGES, AuthActionError, AuthErrorType } from '@/server/error/auth';

const rateLimiter = new RateLimiter();

const RATE_LIMIT_CONFIG = {
  shortTerm: {
    limit: 3, // allow 3 in short time
    window: 1 * 60 * 1000, // 1 min
  },
  longTerm: {
    window: 30 * 60 * 1000, // 30 min
  },
};

const isValidVerificationRequest = async (email: string) => {
  const limit = new Date(Date.now() - RATE_LIMIT_CONFIG.longTerm.window);
  const existingToken = await getTokenByEmail(email);

  if (!existingToken) return true;

  return new Date(existingToken.expires) < limit;
};

export async function checkEmailVerificationLimits(email: string) {
  try {
    // 1. Check the short limit by Memory and IP
    await rateLimiter.checkRateLimitByIp({
      key: email,
      limit: RATE_LIMIT_CONFIG.shortTerm.limit,
      window: RATE_LIMIT_CONFIG.shortTerm.window,
    });

    // 2. Check the gap of email sending
    const canSendEmail = await isValidVerificationRequest(email);
    if (!canSendEmail) {
      throw new AuthActionError(
        AuthErrorType.VERIFICATION_REQUEST_TOO_FREQUENT,
        AUTH_MESSAGES.VERIFICATION_TOO_FREQUENT,
      );
    }

    return true;
  } catch (error) {
    if (error instanceof AuthActionError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.message.includes('Rate limit exceeded')) {
        throw new AuthActionError(
          AuthErrorType.RATE_LIMIT_EXCEEDED,
          AUTH_MESSAGES.RATE_LIMIT,
          error,
        );
      }

      throw new AuthActionError(
        AuthErrorType.VERIFICATION_FAILED,
        AUTH_MESSAGES.VERIFICATION_FAILED,
        error,
      );
    }
  }
}
