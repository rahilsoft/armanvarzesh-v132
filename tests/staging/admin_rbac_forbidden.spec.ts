import { test, expect } from '@playwright/test';
test('non-admin cannot access admin-only modules', async ({ page }) => {
  const adminBase = process.env.STAGING_ADMIN_BASE_URL || process.env.STAGING_BASE_URL || '';
  await page.goto(adminBase + '/login');
  await page.fill('input', 'FAKE.JWT.NO.ADMIN');
  await page.click('text=Login');
  await page.goto(adminBase + '/certificate');
  await expect(page.locator('text=دسترسی کافی ندارید')).toBeVisible();
});
