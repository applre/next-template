'use client';

import SignOutBtn from '@/components/auth/SignOutBtn';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="">
      <h1 className="my-2 font-bold text-2xl">Profile</h1>
      <pre className="my-2 rounded-lg bg-secondary p-4">{JSON.stringify(session, null, 2)}</pre>
      <SignOutBtn />
    </main>
  );
}
