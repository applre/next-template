import { db } from '@/server/db/index';
import { auth } from '@/lib/auth';

export async function createTRPCContext(opts: { headers: Headers }) {
  const session = await auth();

  return {
    db,
    session,
    ...opts,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
