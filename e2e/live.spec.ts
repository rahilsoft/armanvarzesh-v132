import { test, expect } from '@playwright/test';

test('live list/create (mock)', async ({ page }) => {
  await page.goto('/live');
  await expect(page.getByRole('heading', { name: 'کلاس‌های زنده' })).toBeVisible();
  await page.getByRole('button', { name: 'ایجاد' }).click();
  await expect(page.locator('text=فهرست')).toBeVisible();
});
