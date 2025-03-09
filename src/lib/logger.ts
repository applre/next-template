import pino, { type LoggerOptions } from 'pino';
import type { NodeOptions } from '@highlight-run/node';
import { env } from '@/env';

const highlightConfig = {
  projectID: env.NEXT_PUBLIC_HIGHLIGHT_KEY,
  serviceName: env.NEXT_PUBLIC_HIGHLIGHT_SERVICE_NAME,
  serviceVersion: 'git-sha',
} as NodeOptions;

const pinoConfig = {
  level: 'debug',
  transport: {
    target: '@highlight-run/pino',
    options: highlightConfig,
  },
} as LoggerOptions;

export const logger = pino(pinoConfig);
