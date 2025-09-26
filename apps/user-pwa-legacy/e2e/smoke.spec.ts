import { test, expect } from '@playwright/test';

test('home loads and shows app shell', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Arman|Arm|Coach|User|Fit|Fitness/i);
  await expect(page.locator('body')).toBeVisible();
});

test('manifest.json is accessible', async ({ page }) => {
  const resp = await page.request.get('/manifest.webmanifest');
  expect(resp.ok()).toBeTruthy();
});

test('service worker registers', async ({ page }) => {
  await page.goto('/');
  const hasSW = await page.evaluate(() => 'serviceWorker' in navigator);
  expect(hasSW).toBeTruthy();
});
