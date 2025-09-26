import { describe, it, expect } from 'vitest';
import * as s from '../packages/data/surveys/adapter';
describe('surveys (mock)', ()=>{
  it('load and submit survey', async ()=>{
    const sv = await s.getSurvey('sv_nps');
    expect(sv?.id).toBe('sv_nps');
    const resp = await s.submitSurvey('sv_nps', { q1:10, q2:'great' });
    expect(resp.surveyId).toBe('sv_nps');
  });
});
