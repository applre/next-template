import { useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Apple } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import {
  verifyEmailTokenSchema,
  type VerifyEmailTokenInput,
  verifyOAuthSchema,
  type VerifyOAuthInput,
} from '@/server/validators/auth';
import { verifyEmailTokenAction, verifyOAuthAction } from '@/server/actions/auth';

import { zodResolver } from '@hookform/resolvers/zod';
import { useServerAction } from 'zsa-react';
import { useForm, type SubmitHandler } from 'react-hook-form';

type LoadingState = {
  isSubmitting: boolean;
  isPending: boolean;
};

function useLoadingState(state: LoadingState) {
  const isLoading = useMemo(() => {
    return state.isSubmitting || state.isPending;
  }, [state.isSubmitting, state.isPending]);

  return {
    isLoading,
    ...state,
  };
}

function OAuth() {
  const t = useTranslations('auth.signIn');
  const {
    setValue,
    formState: { isSubmitting },
  } = useForm<VerifyOAuthInput>({
    resolver: zodResolver(verifyOAuthSchema),
  });

  const { execute, isPending, isSuccess, error: actionError } = useServerAction(verifyOAuthAction);

  const { isLoading } = useLoadingState({
    isSubmitting,
    isPending,
  });

  const handleOAuthSubmit = async (type: VerifyOAuthInput['type']) => {
    setValue('type', type);
    await execute({ type });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(t('oauth.success'));
    }
  }, [isSuccess, t]);

  useEffect(() => {
    if (actionError) {
      toast.error(t('oauth.error'));
    }
  }, [actionError, t]);

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        variant="outline"
        onClick={() => handleOAuthSubmit('google')}
        disabled={isSubmitting || isPending}
        className="border-gray-300 bg-white hover:bg-gray-50"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      </Button>
      <Button
        variant="outline"
        onClick={() => handleOAuthSubmit('apple')}
        disabled={isLoading}
        className="border-gray-300 bg-white hover:bg-gray-50"
      >
        <Apple className="h-5 w-5" />
      </Button>
    </div>
  );
}

export default function Component() {
  const t = useTranslations('auth.signIn');
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors: formError },
  } = useForm<VerifyEmailTokenInput>({
    resolver: zodResolver(verifyEmailTokenSchema),
  });

  const {
    execute,
    isPending,
    isSuccess,
    error: actionError,
  } = useServerAction(verifyEmailTokenAction);

  const formOptions = {
    email: {
      required: t('email.required'),
      pattern: {
        value: /\S+@\S+\.\S+/,
        message: t('email.invalid'),
      },
    },
  };

  const { isLoading } = useLoadingState({
    isSubmitting,
    isPending,
  });

  const onSubmit: SubmitHandler<VerifyEmailTokenInput> = async (data) => {
    await execute({ email: data.email });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(t('oauth.success'));
    }
  }, [isSuccess, t]);

  useEffect(() => {
    if (actionError && actionError.code !== 'INPUT_PARSE_ERROR') {
      toast.error(t('oauth.error'));
    }
  }, [actionError, t]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="p-8">
            <h2 className="mb-6 text-center font-bold text-3xl text-gray-800">{t('title')}</h2>
            <p className="mb-8 text-center text-gray-600">{t('description')}</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mb-6 space-y-4">
              <div className="relative">
                <Input
                  {...register('email', formOptions.email)}
                  type="email"
                  placeholder={t('email.placeholder')}
                  className="border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
                  aria-invalid={formError.email ? 'true' : 'false'}
                  aria-describedby={formError.email ? 'email-error' : undefined}
                />
                {formError?.email && (
                  <p className="mt-1 text-red-600 text-sm">{formError.email.message}</p>
                )}
                {actionError && actionError.code === 'INPUT_PARSE_ERROR' && (
                  <p className="mt-1 text-red-600 text-sm">{actionError.fieldErrors.email}</p>
                )}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 pressed:bg-blue-800 text-white hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? t('submit.loading') : t('submit.default')}
              </Button>
            </form>
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-gray-300 border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">{t('divider')}</span>
              </div>
            </div>

            <OAuth />
          </div>
        </div>
      </div>
    </div>
  );
}
