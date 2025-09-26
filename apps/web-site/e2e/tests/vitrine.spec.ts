
import { test, expect } from '@playwright/test';

test('home renders vitrine grid', async ({ page }) => {
  await page.goto('/');
  const n = await page.locator('.tile-card').count();
  expect(n).toBeGreaterThan(0);
});

test('admin cms page shows login controls', async ({ page }) => {
  await page.goto('/admin/cms');
  await expect(page.getByText('Login')).toBeVisible();
});
