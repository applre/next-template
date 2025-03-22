'use client';

import SignOutBtn from '@/components/auth/SignOutBtn';
import { useSession } from '@/components/auth/AuthContext';

export default function Home() {
  const { session } = useSession();

  return (
    <main className="">
      <h1 className="my-2 font-bold text-2xl">Profile</h1>
      <pre className="my-2 rounded-lg bg-secondary p-4">{JSON.stringify(session, null, 2)}</pre>
      <SignOutBtn />
    </main>
  );
}
