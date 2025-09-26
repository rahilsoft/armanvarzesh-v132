
import { test, expect } from "@playwright/test";

test("admin can login to dashboard", async ({ page }) => {
  await page.goto("http://localhost:8080/admin/login");
  await page.fill("input[type='email']", "admin@armanfit.com");
  await page.fill("input[type='password']", "adminpass");
  await page.click("button[type='submit']");
  await expect(page).toHaveURL(/admin\/dashboard/);
  await expect(page.locator("text=Dashboard")).toBeVisible();
});
