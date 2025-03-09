'use client';

import UpdateNameCard from './UpdateNameCard';
import UpdateEmailCard from './UpdateEmailCard';
import { useSession } from 'next-auth/react';

export default function UserSettings() {
  const { data: session } = useSession();
  const { user } = session || {};

  return (
    <>
      {/* <UpdateNameCard name={user?.name ?? ''} />
      <UpdateEmailCard email={session?.user.email ?? ''} /> */}
    </>
  );
}
