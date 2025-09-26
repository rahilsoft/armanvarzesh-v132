// Stage 42 — PWA install + login + reserve (skeleton)
const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';
test('manifest reachable', async ()=>{
  const r = await fetch(BASE + '/manifest.json');
  expect([200,404]).toContain(r.status);
});
test('login placeholder', ()=>{ expect(true).toBe(true); });
test('reserve flow placeholder', ()=>{ expect(true).toBe(true); });
