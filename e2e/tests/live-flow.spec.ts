import { test, expect, request } from '@playwright/test';
const GQL = process.env.LIVE_E2E_URL || 'http://localhost:4004/graphql';
async function gql(q: string, variables: any = {}) {
  const ctx = await request.newContext();
  const res = await ctx.post(GQL, { data: { query: q, variables } });
  const json = await res.json();
  if (!res.ok()) { console.error(json); }
  return { ok: res.ok(), json };
}
test('coach start -> user join -> comment/reaction -> end', async () => {
  const coachId = 'coach_1';
  const r1 = await gql(`mutation($coachId:ID!){ startLive(coachId:$coachId, title:"Leg Day", max:5, record:true){ id title status } }`, { coachId });
  expect(r1.ok).toBeTruthy();
  const sessionId = r1.json.data.startLive.id;
  const r2 = await gql(`mutation($sid:ID!){ joinLive(sessionId:$sid, userId:"u1", consent:VIDEO, shareVideo:true){ id } }`, { sid: sessionId });
  expect(r2.ok).toBeTruthy();
  const r3 = await gql(`mutation($sid:ID!){ sendComment(sessionId:$sid, userId:"u1", text:"hello"){ id text } }`, { sid: sessionId });
  expect(r3.ok).toBeTruthy();
  const r4 = await gql(`mutation($sid:ID!){ sendReaction(sessionId:$sid, userId:"u1", emoji:"👍"){ id emoji } }`, { sid: sessionId });
  expect(r4.ok).toBeTruthy();
  const r5 = await gql(`mutation($sid:ID!){ endLive(sessionId:$sid){ id status recordingUrl } }`, { sid: sessionId });
  expect(r5.ok).toBeTruthy();
  expect(r5.json.data.endLive.status).toBe('ENDED');
});
