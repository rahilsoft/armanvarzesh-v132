
import { device, element, by, expect } from 'detox';

describe('App Boot', () => {
  beforeAll(async () => { await device.launchApp(); });
  it('shows a header somewhere', async () => {
    await expect(element(by.type('android.widget.TextView'))).toBeVisible();
  });
});
