import { describe, it, expect } from 'vitest';
import { articleLD, orgLD } from '../packages/seo/schema';
describe('seo schema', ()=>{
  it('article ld has context/type', ()=>{
    const a = articleLD({ headline:'t', datePublished:new Date().toISOString(), author:'a', url:'u' });
    expect(a['@context']).toBe('https://schema.org');
    expect(a['@type']).toBe('Article');
  });
  it('org ld basic', ()=>{
    const o = orgLD({ name:'Arman', url:'https://arman.example' });
    expect(o['@type']).toBe('Organization');
  });
});
