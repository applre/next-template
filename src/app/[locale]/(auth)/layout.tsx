// 'use client';

// import { api } from '@/server/trpc/react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in to your account',
  description: 'Login Page',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [hello] = api.computers.getComputers.useSuspenseQuery({ text: 'hello' });
  // console.log(11, hello);

  return <div className="h-screen bg-muted">{children}</div>;
}
