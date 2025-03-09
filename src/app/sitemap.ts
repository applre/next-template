import type { MetadataRoute } from 'next';
import { env } from '@/env.js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['', '/dashboard', '/dashboard/billing'].map((route) => ({
    url: `${env.NEXT_PUBLIC_APP_URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes];
}
