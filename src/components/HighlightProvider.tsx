import { HighlightInit } from '@highlight-run/next/client';
import { env } from '@/env.js';

export function HighlightProvider() {
  return (
    <HighlightInit
      projectId={env.NEXT_PUBLIC_HIGHLIGHT_KEY}
      serviceName="my-nextjs-frontend"
      tracingOrigins
      networkRecording={{
        enabled: true,
        recordHeadersAndBody: true,
        urlBlocklist: [],
      }}
    />
  );
}
