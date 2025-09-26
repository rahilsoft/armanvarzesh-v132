describe('User App — smoke', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('launches without crashing', async () => {
    await expect(device).toBeReady();
  });
});
