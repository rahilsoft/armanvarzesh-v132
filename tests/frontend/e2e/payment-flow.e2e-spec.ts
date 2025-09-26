
import { test, expect } from "@playwright/test";

test("user can complete payment", async ({ page }) => {
  await page.goto("http://localhost:5173/login");
  await page.fill("input[type='email']", "user@armanfit.com");
  await page.fill("input[type='password']", "password123");
  await page.click("button[type='submit']");
  await page.goto("http://localhost:5173/wallet");
  await page.click("text=Recharge");
  await page.fill("input[name='amount']", "500000");
  await page.click("button[type='submit']");
  await expect(page.locator("text=Payment Successful")).toBeVisible();
});
