
import { test, expect } from "@playwright/test";

test("user can view and start workout", async ({ page }) => {
  await page.goto("http://localhost:5173/login");
  await page.fill("input[type='email']", "user@armanfit.com");
  await page.fill("input[type='password']", "password123");
  await page.click("button[type='submit']");
  await page.goto("http://localhost:5173/workouts");
  await expect(page.locator("text=Workout List")).toBeVisible();
  await page.click("text=Start Workout");
  await expect(page.locator("text=Workout In Progress")).toBeVisible();
});
