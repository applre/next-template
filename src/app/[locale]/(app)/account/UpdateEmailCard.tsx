'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AccountCard, AccountCardFooter, AccountCardBody } from './AccountCard';
import { updateUser } from '@/server/actions/user';

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
    try {
      // Get user ID from session or use a placeholder for now
      // In a real app, you would get this from the session
      const userId = 'user_id'; // This should come from auth session
      
      const [result, error] = await updateUser({
        id: userId,
        email: data.email,
      });
      
      if (error) {
        toast.error('Error', { description: error.message || 'Failed to update email' });
      } else if (result?.success) {
        toast.success('Updated Email');
      }
    } catch (error) {
      toast.error('Error', { description: 'An unexpected error occurred' });
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
