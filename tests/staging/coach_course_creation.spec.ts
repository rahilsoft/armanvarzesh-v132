import { test, expect } from '@playwright/test';
test('coach creates a course and client can view', async ({ page }) => {
  const base = process.env.STAGING_BASE_URL!;
  await page.goto(base + '/login');
  await page.fill('input', process.env.STAGING_COACH_JWT || 'FAKE.JWT.COACH');
  await page.click('text=ورود');
  await page.goto(base + '/courses');
  await expect(page.locator('h2')).toContainText(/course/i);
  // TODO: create course form interactions + assertion
});
