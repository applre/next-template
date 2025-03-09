import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/nextjs',
  // framework: '@storybook/experimental-nextjs-vite',
  // async viteFinal(config) {
  //   // Add custom Vite configuration here
  //   return {
  //     ...config,
  //     resolve: {
  //       alias: {
  //         React: require.resolve('react'),
  //         '@': '/src',
  //       },
  //     },
  //     // Add environment variables
  //     define: {
  //       'process.env': process.env,
  //     },
  //   };
  // },
};

export default config;
