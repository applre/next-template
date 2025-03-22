'use client';

import UpdateNameCard from './UpdateNameCard';
import UpdateEmailCard from './UpdateEmailCard';
import { useSession } from '@/components/auth/AuthContext';

export default function UserSettings() {
  const { session } = useSession();
  const { user } = session || {};

  return (
    <>
      {/* <UpdateNameCard name={user?.name ?? ''} />
      <UpdateEmailCard email={session?.user.email ?? ''} /> */}
    </>
  );
}
