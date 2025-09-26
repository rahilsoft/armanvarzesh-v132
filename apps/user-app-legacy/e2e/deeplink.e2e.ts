describe('Deep link', () => {
  it('opens home via scheme', async () => {
    const url = process.env.DEEPLINK_URL || 'armanuser://home';
    await device.launchApp({ newInstance: true, url });
    // Adjust testID below to your real home screen identifier
    // Example: <View testID="home-screen" />
    // await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
