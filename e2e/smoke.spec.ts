import { test, expect } from '@playwright/test';

test('login → create workout → receive notification', async ({ page }) => {
  const webUrl = process.env.WEB_URL!;
  const notifUrl = process.env.NOTIF_CENTER_URL || webUrl + '/notifications';
  const user = process.env.E2E_USER!;
  const pass = process.env.E2E_PASS!;

  await page.goto(webUrl);
  await page.getByLabel('Email').fill(user);
  await page.getByLabel('Password').fill(pass);
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page.getByText(/dashboard/i)).toBeVisible();

  const newWorkoutBtn = page.getByRole('button', { name: /new workout/i });
  if (await newWorkoutBtn.isVisible()) {
    await newWorkoutBtn.click();
    await page.getByLabel('Type').selectOption('running');
    await page.getByLabel('Distance').fill('3');
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByText(/workout saved/i)).toBeVisible();
  }

  await page.goto(notifUrl);
  await expect(page.getByText(/workout/i)).toBeVisible();
});
