import { test, expect } from '@playwright/test';

test('home loads and has manifest link', async ({ page }) => {
  await page.goto('/');
  const hasManifest = await page.locator('link[rel="manifest"]').first().isVisible().catch(()=>false);
  expect(hasManifest).toBeTruthy();
});