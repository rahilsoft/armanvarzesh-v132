import { describe, it, expect } from 'vitest';
import * as n from '../packages/data/notifications/adapter';
describe('notifications adapter (mock)', ()=>{
  it('get/set prefs and list feed', async ()=>{
    const prefs = await n.getPrefs();
    expect(prefs).toHaveProperty('push');
    const next = await n.setPrefs({ push: !prefs.push });
    expect(next.push).toBe(!prefs.push);
    const feed = await n.listFeed();
    expect(feed.length).toBeGreaterThan(0);
  });
});
