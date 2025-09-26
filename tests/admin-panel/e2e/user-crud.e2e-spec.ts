
import { test, expect } from "@playwright/test";

test("admin can create, edit, and delete a user", async ({ page }) => {
  await page.goto("http://localhost:8080/admin/login");
  await page.fill("input[type='email']", "admin@armanfit.com");
  await page.fill("input[type='password']", "adminpass");
  await page.click("button[type='submit']");
  await page.goto("http://localhost:8080/admin/users");
  await page.click("text=Create User");
  await page.fill("input[name='name']", "Test Admin User");
  await page.fill("input[name='email']", "newuser@armanfit.com");
  await page.click("button[type='submit']");
  await expect(page.locator("text=Test Admin User")).toBeVisible();
  await page.click("text=Edit");
  await page.fill("input[name='name']", "Edited Admin User");
  await page.click("button[type='submit']");
  await expect(page.locator("text=Edited Admin User")).toBeVisible();
  await page.click("text=Delete");
  await expect(page.locator("text=Edited Admin User")).not.toBeVisible();
});
