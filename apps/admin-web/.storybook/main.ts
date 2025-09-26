import type { StorybookConfig } from '@storybook/react-vite';
import helmet from "helmet";
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: { name: '@storybook/react-vite', options: {} },
};
export default config;