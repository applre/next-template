'use client';

import { useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { signOutAction } from '@/server/actions/auth';
import { useServerAction } from 'zsa-react';
import { useTranslations } from 'next-intl';

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

export default function SignOutBtn() {
  const t = useTranslations('auth.signOut');
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const { execute, isPending, isSuccess, error: actionError } = useServerAction(signOutAction);

  const { isLoading } = useLoadingState({
    isSubmitting,
    isPending,
  });

  const onSubmit = async () => {
    await execute();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(t('success'));
    }
  }, [isSuccess, t]);

  useEffect(() => {
    if (actionError) {
      toast.error(t('error'));
    }
  }, [actionError, t]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full text-left">
      <Button type="submit" disabled={isLoading} variant="destructive">
        {isLoading ? t('button.loading') : t('button.default')}
      </Button>
    </form>
  );
}
