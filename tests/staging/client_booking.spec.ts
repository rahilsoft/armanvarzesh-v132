import { test, expect } from '@playwright/test';
test('client can book a slot and coach sees it', async ({ page }) => {
  const base = process.env.STAGING_BASE_URL!;
  await page.goto(base + '/login');
  await page.fill('input', process.env.STAGING_USER_JWT || 'FAKE.JWT.USER');
  await page.click('text=ورود');
  await page.goto(base + '/booking');
  await expect(page.locator('h2')).toContainText(/booking/i);
  // TODO: select a real slot selector and confirm booking
});
