import { describe, it, expect } from 'vitest';
import * as a from '../packages/data/assessments/adapter';
describe('assessments (mock)', ()=>{
  it('template & draft save/submit', async ()=>{
    const tpl = await a.getTemplate(); expect(tpl.id).toBeTruthy();
    const d = { id:'d', templateId: tpl.id, values:{ age:30 }, step:1, updatedAt: Date.now() };
    await a.saveDraft(d as any);
    const draft = await a.loadDraft(tpl.id);
    expect(draft?.values?.age).toBe(30);
    const sub = await a.submit({ age:30 }, tpl.id);
    expect(sub.templateId).toBe(tpl.id);
  });
});
