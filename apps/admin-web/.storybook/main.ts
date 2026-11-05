import type { StorybookConfig } from '@storybook/react-vite';
import _helmet from "helmet";
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [],
  framework: { name: '@storybook/react-vite', options: {} },
  // The app vite.config registers vite-plugin-pwa. A service worker has no place
  // in Storybook, and vite-plugin-pwa 2 fails the build on Storybook's large runtime chunk.
  async viteFinal(viteConfig) {
    const isPwa = (p: unknown): boolean =>
      Array.isArray(p)
        ? p.some(isPwa)
        : !!p && typeof p === 'object' && String((p as { name?: string }).name ?? '').startsWith('vite-plugin-pwa');
    return { ...viteConfig, plugins: (viteConfig.plugins ?? []).filter((p) => !isPwa(p)) };
  },
};
export default config;
