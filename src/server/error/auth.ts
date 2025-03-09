import { AuthError } from 'next-auth';

export const AUTH_MESSAGES = {
  // 错误消息
  RATE_LIMIT: '请求过于频繁，请稍后再试',
  VERIFICATION_TOO_FREQUENT: '请等待一段时间后再请求验证邮件',
  VERIFICATION_FAILED: '验证失败，请稍后重试',
  EMAIL_SEND_FAILED: '邮件发送失败，请稍后重试',
  INVALID_CREDENTIALS: '验证失败，请检查您的邮箱地址',
  OAUTH_FAILED: '第三方登录失败，请稍后重试',
  OAUTH_CALLBACK_FAILED: '无法完成身份验证，请重试',
  ACCOUNT_LINKED: '此邮箱已被其他方式注册，请使用其他登录方式',
  UNKNOWN_ERROR: '发生错误，请稍后重试',

  INVALID_TOKEN: '验证链接已过期或无效',
  USER_NOT_FOUND: '用户不存在',

  // 成功消息
  LOGIN_LINK_SENT: '登录链接已发送到您的邮箱',
} as const;

export enum AuthErrorType {
  // 验证相关
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  VERIFICATION_REQUEST_TOO_FREQUENT = 'VERIFICATION_REQUEST_TOO_FREQUENT',
  VERIFICATION_FAILED = 'VERIFICATION_FAILED',
  INVALID_TOKEN = 'INVALID_OR_EXPIRED_TOKEN',
  USER_NOT_FOUND = 'USER_NOT_FOUND',

  // Auth
  EMAIL_SIGN_IN_ERROR = 'EmailSignInError',
  CREDENTIALS_SIGNIN = 'CredentialsSignin',
  OAUTH_SIGN_IN_ERROR = 'OAuthSignInError',
  OAUTH_CALLBACK_ERROR = 'OAuthCallbackError',
  ACCOUNT_NOT_LINKED = 'AccountNotLinked',
}

export class AuthActionError extends Error {
  constructor(
    public type: AuthErrorType,
    public message: string,
    public cause?: unknown,
  ) {
    super(message);
    this.name = 'AuthActionError';
  }
}

interface ActionResponse {
  success?: boolean;
  error?: string;
  message?: string;
}

export function handleAuthError(error: unknown): ActionResponse {
  // Handle AuthActionError
  if (error instanceof AuthActionError) {
    return { error: error.message };
  }

  // Handle next-auth AuthError
  if (error instanceof AuthError) {
    const errorMap: Record<string, string> = {
      [AuthErrorType.EMAIL_SIGN_IN_ERROR]: AUTH_MESSAGES.EMAIL_SEND_FAILED,
      [AuthErrorType.CREDENTIALS_SIGNIN]: AUTH_MESSAGES.INVALID_CREDENTIALS,
      [AuthErrorType.OAUTH_SIGN_IN_ERROR]: AUTH_MESSAGES.OAUTH_FAILED,
      [AuthErrorType.OAUTH_CALLBACK_ERROR]: AUTH_MESSAGES.OAUTH_CALLBACK_FAILED,
      [AuthErrorType.ACCOUNT_NOT_LINKED]: AUTH_MESSAGES.ACCOUNT_LINKED,
    };

    return { error: errorMap[error.type] ?? AUTH_MESSAGES.UNKNOWN_ERROR };
  }

  // Handle other Error
  return { error: AUTH_MESSAGES.UNKNOWN_ERROR };
}
