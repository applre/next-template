'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { AccountCard, AccountCardFooter, AccountCardBody } from './AccountCard';
import { updateUser } from '@/server/actions/auth';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type FormData = {
  name: string;
};

export default function UpdateNameCard({ name }: { name: string }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    defaultValues: {
      name: name || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('name', data.name);

    const result = await updateUser(formData);
    if (result.error) {
      toast.error('Error', { description: result.error });
    } else if (result.success) {
      toast.success('Updated User');
    }
  };

  useEffect(() => {
    if (errors.name) {
      toast.error('Error', { description: errors.name.message });
    }
  }, [errors]);

  return (
    <AccountCard
      params={{
        header: 'Your Name',
        description: 'Please enter your full name, or a display name you are comfortable with.',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <AccountCardBody>
          <Input
            {...register('name', {
              required: 'Name is required',
              maxLength: {
                value: 64,
                message: 'Name must be 64 characters or less',
              },
            })}
          />
        </AccountCardBody>
        <AccountCardFooter description="64 characters maximum">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Name'}
          </Button>
        </AccountCardFooter>
      </form>
    </AccountCard>
  );
}
