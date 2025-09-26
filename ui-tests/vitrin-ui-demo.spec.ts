import { test, expect } from '@playwright/test';
test('ui-demo renders and allows typing', async ({ page }) => {
  await page.goto('/ui-demo');
  await page.getByPlaceholder('نام شما').fill('حسین');
  await page.getByRole('button', { name: 'ارسال' }).click();
  await expect(page).toHaveURL(/ui-demo/);
});
