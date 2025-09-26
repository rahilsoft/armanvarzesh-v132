import type { StorybookConfig } from '@storybook/nextjs';
import helmet from "helmet";
const config: StorybookConfig = {
  stories: ['../**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: { name: '@storybook/nextjs', options: {} },
};
export default config;