import { test, expect } from '@playwright/test';

test('home loads and shows CTA', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.locator('text=شروع کن')).toBeVisible();
});

test('pricing page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/pricing');
  await expect(page.locator('text=پلن‌ها و قیمت‌ها')).toBeVisible();
});
