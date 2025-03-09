import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { H, Handlers } from '@highlight-run/node';

import type { NextRequest } from 'next/server';
import { appRouter } from '@/server/api/routers/_app';
import { createTRPCContext } from '@/server/trpc/context';
import { env } from '@/env.js';

if (typeof process.env.NEXT_RUNTIME === 'undefined' || process.env.NEXT_RUNTIME === 'nodejs') {
  H.init({
    projectID: env.NEXT_PUBLIC_HIGHLIGHT_KEY,
    serviceName: env.NEXT_PUBLIC_HIGHLIGHT_SERVICE_NAME,
    environment: 'production',
  });
}

const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError: ({ error, req }) => {
      const headers = Object.fromEntries(req.headers.entries());
      Handlers.trpcOnError(
        { error, req: { headers } },
        {
          projectID: env.NEXT_PUBLIC_HIGHLIGHT_KEY,
          serviceName: env.NEXT_PUBLIC_HIGHLIGHT_SERVICE_NAME,
          serviceVersion: 'git-sha',
          environment: 'production',
        },
      );
    },
  });

export { handler as GET, handler as POST };
