describe('App bootstrap', () => {
  it('launches', async () => {
    await device.launchApp();
    await expect(element(by.type('RCTRootView'))).toBeVisible();
  });
});
