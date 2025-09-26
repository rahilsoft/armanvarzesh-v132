import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home renders and has no critical a11y violations', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Arman Varzesh/i);

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  const critical = accessibilityScanResults.violations.filter(v => v.impact === 'critical');
  expect(critical, JSON.stringify(accessibilityScanResults.violations, null, 2)).toHaveLength(0);
});
