
import { device, expect, element, by } from "detox";

describe("Onboarding Flow (Mobile)", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it("should show onboarding and go to login", async () => {
    await expect(element(by.text("Welcome to ArmanFit"))).toBeVisible();
    await element(by.text("Get Started")).tap();
    await expect(element(by.text("Login"))).toBeVisible();
  });
});
