import { test, expect } from '@playwright/test';
test('client purchases VIP and sees status', async ({ page }) => {
  const base = process.env.STAGING_BASE_URL!;
  await page.goto(base + '/login');
  await page.fill('input', process.env.STAGING_USER_JWT || 'FAKE.JWT.USER');
  await page.click('text=ورود');
  await page.goto(base + '/vip');
  await expect(page.locator('h2')).toContainText(/vip/i);
  // TODO: trigger checkout and verify VIP badge
});
