import { z } from 'zod';

// Common validation rules
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const CODE_REGEX = /^[0-9]{6}$/;

/**
 * OAuth provider types supported by the application
 */
export const OAuthProviders = {
  GOOGLE: 'google',
  MICROSOFT: 'microsoft',
  APPLE: 'apple',
  WECHAT: 'wechat',
} as const;

/**
 * Email validation schema with custom error messages
 */
export const verifyEmailTokenSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email('Please enter a valid email address')
    .regex(EMAIL_REGEX, 'Invalid email format')
    .min(5, 'Email is too short')
    .max(254, 'Email is too long')
    .toLowerCase()
    .trim(),
});

export type VerifyEmailTokenInput = z.infer<typeof verifyEmailTokenSchema>;

/**
 * OAuth provider validation schema
 */
export const verifyOAuthSchema = z.object({
  type: z.enum(
    [OAuthProviders.GOOGLE, OAuthProviders.MICROSOFT, OAuthProviders.APPLE, OAuthProviders.WECHAT],
    {
      required_error: 'OAuth provider type is required',
      invalid_type_error: 'Invalid OAuth provider type',
    },
  ),
});

export type VerifyOAuthInput = z.infer<typeof verifyOAuthSchema>;

/**
 * Verification code validation schema
 */
export const verifyCodeSchema = z.object({
  code: z
    .string({
      required_error: 'Verification code is required',
      invalid_type_error: 'Code must be a string',
    })
    .regex(CODE_REGEX, 'Code must be 6 digits')
    .transform((val) => val.trim()),
});

export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;

/**
 * Token validation schema
 */
export const verifyTokenSchema = z.object({
  token: z
    .string({
      required_error: 'Token is required',
      invalid_type_error: 'Token must be a string',
    })
    .min(1, 'Token cannot be empty')
    .max(255, 'Token is too long'),
  identifier: z.string().email('Invalid identifier format').min(1, 'Identifier cannot be empty'),
});

export type VerifyTokenInput = z.infer<typeof verifyTokenSchema>;
