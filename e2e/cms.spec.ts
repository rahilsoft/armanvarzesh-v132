import { test, expect } from '@playwright/test';

test('blog index + article (mock)', async ({ page }) => {
  await page.goto('/blog');
  await expect(page.getByRole('heading', { name: 'بلاگ' })).toBeVisible();
  const first = page.locator('a:has-text("ادامه")').first();
  const href = await first.getAttribute('href');
  await first.click();
  await expect(page).toHaveURL(href!);
});
