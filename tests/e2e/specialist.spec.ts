
import { test, expect } from '@playwright/test';

test('login and visit specialist dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'ورود' }).click();
  await page.waitForURL('**/specialist');
  await expect(page.locator('h1')).toContainText('کارشناس');
});

test('open library and filter', async ({ page }) => {
  await page.goto('/specialist/library');
  await expect(page.locator('h1')).toContainText('کتابخانه');
});

test('open plan builder and export', async ({ page }) => {
  await page.goto('/specialist/plan');
  await expect(page.locator('h1')).toContainText('برنامه');
});
