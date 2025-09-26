import { test, expect } from '@playwright/test';
test('has landmarks', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
  await expect(page.getByRole('link', { name: /پرش به محتوای اصلی|پرش/i })).toBeVisible();
});
