import { test, expect } from '@playwright/test';

test('chat send text (mock)', async ({ page }) => {
  await page.goto('/chat');
  await expect(page.getByRole('heading', { name: 'چت' })).toBeVisible();
  await page.getByPlaceholder('پیام…').fill('hello');
  await page.getByRole('button', { name: 'ارسال' }).click();
  await expect(page.locator('text=hello')).toBeVisible();
});
