
import { test, expect } from '@playwright/test';

test('home visual baseline', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // hide preview badge if present for stable snapshot
  await page.addStyleTag({ content: '[style*="position:fixed"][style*="z-index:9999"]{ opacity:0 !important }' });
  expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('home.png', { maxDiffPixels: 500 });
});
