import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // TODO: Test can't pass
  // experimental: {
  //   ppr: 'incremental',
  // },
};

export default withNextIntl(nextConfig);
