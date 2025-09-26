import { test, expect } from '@playwright/test';

test('visual: home page baseline', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // mask dynamic cursors/time elements if any
  await expect(page).toHaveScreenshot('home.png', { fullPage: true });
});

test('visual: manifest accessible', async ({ page }) => {
  const resp = await page.request.get('/manifest.webmanifest');
  expect(resp.ok()).toBeTruthy();
});
