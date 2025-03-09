import { headers } from 'next/headers';

async function getIp() {
  const forwardedFor = (await headers()).get('x-forwarded-for');
  const realIp = (await headers()).get('x-real-ip');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  return null;
}

interface RateLimitEntry {
  count: number;
  expiresAt: number;
}

export class RateLimiter {
  private trackers = new Map<string, RateLimitEntry>();
  private lastPruneTime = Date.now();
  private readonly PRUNE_THRESHOLD = 60 * 1000; // 1 minute

  private pruneIfNeeded() {
    const now = Date.now();
    // Only prune if enough time has passed
    if (now - this.lastPruneTime >= this.PRUNE_THRESHOLD) {
      this.pruneTrackers();
      this.lastPruneTime = now;
    }
  }

  private pruneTrackers() {
    const now = Date.now();
    for (const [key, value] of this.trackers.entries()) {
      if (value.expiresAt < now) {
        this.trackers.delete(key);
      }
    }
  }

  async checkRateLimit({
    key = 'global',
    limit = 1,
    window = 10000,
  }: {
    key: string;
    limit: number;
    window: number;
  }): Promise<void> {
    this.pruneIfNeeded();

    const tracker = this.trackers.get(key) || { count: 0, expiresAt: 0 };

    if (tracker.expiresAt < Date.now()) {
      tracker.count = 0;
      tracker.expiresAt = Date.now() + window;
    }

    tracker.count++;
    if (tracker.count > limit) {
      throw new Error('Rate limit exceeded');
    }

    this.trackers.set(key, tracker);
  }

  async checkRateLimitByIp({
    key = 'global',
    limit = 1,
    window = 10000,
  }: {
    key: string;
    limit: number;
    window: number;
  }): Promise<void> {
    const ip = getIp();
    if (!ip) {
      throw new Error('IP address not found');
    }

    await this.checkRateLimit({
      key: `${ip}-${key}`,
      limit,
      window,
    });
  }
}
