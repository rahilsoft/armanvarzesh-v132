
import { device, expect, element, by } from "detox";

describe("Workout Submit (Mobile)", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it("should allow user to submit workout", async () => {
    await element(by.text("Login")).tap();
    await element(by.id("email")).typeText("user@armanfit.com");
    await element(by.id("password")).typeText("password123");
    await element(by.text("Sign In")).tap();
    await element(by.text("Workout List")).tap();
    await element(by.text("Start Workout")).tap();
    await expect(element(by.text("Workout In Progress"))).toBeVisible();
    await element(by.text("Finish")).tap();
    await expect(element(by.text("Workout Submitted"))).toBeVisible();
  });
});
