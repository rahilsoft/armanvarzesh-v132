
import { test, expect } from '@playwright/test';
test('homepage loads', async ({ page }) => {
  const url = process.env.BASE_URL || 'http://localhost:3000';
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  expect(await page.title()).not.toBeNull();
});
