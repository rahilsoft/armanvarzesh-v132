import { defineConfig } from '@playwright/test';
export default defineConfig({
  use: {
    baseURL: process.env.STAGING_BASE_URL || 'http://localhost:3000',
    headless: true,
  },
  timeout: 60000
});
