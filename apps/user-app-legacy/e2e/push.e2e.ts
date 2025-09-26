describe('Push E2E', () => {
  it('receives a local notification and exposes a marker', async () => {
    await device.launchApp({ newInstance: true, url: 'armanuser://e2e-trigger-push' });
    await waitFor(element(by.id('push-received'))).toBeVisible().withTimeout(15000);
  });
});