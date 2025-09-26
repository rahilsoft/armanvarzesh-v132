
import { test, expect } from "@playwright/test";

test("user can login via UI", async ({ page }) => {
  await page.goto("http://localhost:5173/login");
  await page.fill("input[type='email']", "user@armanfit.com");
  await page.fill("input[type='password']", "password123");
  await page.click("button[type='submit']");
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.locator("text=Dashboard")).toBeVisible();
});
