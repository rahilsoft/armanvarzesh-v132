import { test, expect } from '@playwright/test';

test('app shell is reachable', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});
