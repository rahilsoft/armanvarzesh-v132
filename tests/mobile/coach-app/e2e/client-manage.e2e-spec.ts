
import { device, expect, element, by } from "detox";

describe("Coach Client Management (Mobile)", () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it("should let coach view and add clients", async () => {
    await element(by.text("Coach Login")).tap();
    await element(by.id("email")).typeText("coach@armanfit.com");
    await element(by.id("password")).typeText("coachpass");
    await element(by.text("Sign In")).tap();
    await element(by.text("Client List")).tap();
    await expect(element(by.text("Add Client"))).toBeVisible();
    await element(by.text("Add Client")).tap();
    await element(by.id("client-name")).typeText("Test Client");
    await element(by.text("Save")).tap();
    await expect(element(by.text("Test Client"))).toBeVisible();
  });
});
