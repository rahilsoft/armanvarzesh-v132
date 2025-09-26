import { test, expect } from '@playwright/test';

test('theme toggle switches data-theme', async ({ page }) => {
  await page.goto('/');
  const before = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'light');
  // try to click toggle button
  const btn = page.getByRole('button', { name: /toggle theme/i });
  if (await btn.isVisible()) {
    await btn.click();
    const after = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'light');
    expect(after).not.toBe(before);
  } else {
    test.skip(true, 'No toggle present on this route');
  }
});
