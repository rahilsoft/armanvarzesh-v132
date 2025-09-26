
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home has no critical a11y violations', async ({ page }) => {
  await page.goto('/');
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  const critical = accessibilityScanResults.violations.filter(v => ['critical','serious'].includes(v.impact || 'minor'));
  expect(critical).toEqual([]);
});
