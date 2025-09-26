import { describe, it, expect } from 'vitest';
import * as cms from '../packages/data/cms/adapter';
describe('cms adapter (mock)', ()=>{
  it('lists posts and reads one', async ()=>{
    const list = await cms.listPosts();
    expect(list.length).toBeGreaterThan(0);
    const p = await cms.getPost(list[0].slug);
    expect(p?.slug).toBe(list[0].slug);
  });
});
