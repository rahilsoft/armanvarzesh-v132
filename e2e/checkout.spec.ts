import { test, expect } from '@playwright/test';

test('web checkout flow (mock)', async ({ page }) => {
  await page.goto('/checkout');
  await expect(page.getByRole('heading', { name: 'تسویه' })).toBeVisible();
  await page.getByRole('button', { name: 'پرداخت کن' }).click();
  await expect(page.locator('text=پرداخت')).toBeVisible();
});
