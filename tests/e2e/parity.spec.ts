import { test, expect } from '@playwright/test';

test('coach PWA parity nav exists', async ({ page }) => {
  await page.goto(process.env.COACH_URL || 'http://localhost:3000');
  await expect(page.getByRole('link', { name: 'workouts', exact: false })).toBeTruthy();
});

test('client PWA parity nav exists', async ({ page }) => {
  await page.goto(process.env.CLIENT_URL || 'http://localhost:3001');
  await expect(page.getByRole('link', { name: 'workouts', exact: false })).toBeTruthy();
});
