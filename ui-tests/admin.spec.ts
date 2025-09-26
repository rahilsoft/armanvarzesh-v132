import { test, expect } from '@playwright/test';
test('admin loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});
