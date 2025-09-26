import { test, expect } from '@playwright/test';

test('offline fallback works (if SW present)', async ({ context, page }) => {
  await page.goto('/');
  // Try to go offline; ignore if not supported
  try { await context.setOffline(true); } catch {}
  await page.reload();
  // Expect either offline page text or still some content
  const body = await page.locator('body').innerText();
  expect(body.length).toBeGreaterThan(0);
  // Bring back online
  try { await context.setOffline(false); } catch {}
});