'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AccountCard, AccountCardFooter, AccountCardBody } from './AccountCard';
import { updateUser } from '@/server/actions/auth';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type FormData = {
  email: string;
};

export default function UpdateEmailCard({ email }: { email: string }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    defaultValues: {
      email: email || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('email', data.email);

    const result = await updateUser(formData);
    if (result.error) {
      toast.error('Error', { description: result.error });
    } else if (result.success) {
      toast.success('Updated Email');
    }
  };

  useEffect(() => {
    if (errors.email) {
      toast.error('Error', { description: errors.email.message });
    }
  }, [errors]);

  return (
    <AccountCard
      params={{
        header: 'Your Email',
        description: 'Please enter the email address you want to use with your account.',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <AccountCardBody>
          <Input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            type="email"
          />
        </AccountCardBody>
        <AccountCardFooter description="We will email you to verify this change.">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Email'}
          </Button>
        </AccountCardFooter>
      </form>
    </AccountCard>
  );
}
