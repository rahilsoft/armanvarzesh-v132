import { test, expect } from '@playwright/test';
test('FAQ page renders', async ({ page }) => {
  await page.goto('http://localhost:3000/faq');
  await expect(page.locator('text=سوالات پرتکرار')).toBeVisible();
});
test('Contact page renders', async ({ page }) => {
  await page.goto('http://localhost:3000/contact');
  await expect(page.locator('text=تماس با ما')).toBeVisible();
});
