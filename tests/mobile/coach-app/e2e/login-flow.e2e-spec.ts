
import { device, expect, element, by } from "detox";

describe("Coach Login Flow (Mobile)", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it("should allow coach to login", async () => {
    await expect(element(by.text("Coach Login"))).toBeVisible();
    await element(by.id("email")).typeText("coach@armanfit.com");
    await element(by.id("password")).typeText("coachpass");
    await element(by.text("Sign In")).tap();
    await expect(element(by.text("Dashboard"))).toBeVisible();
  });
});
