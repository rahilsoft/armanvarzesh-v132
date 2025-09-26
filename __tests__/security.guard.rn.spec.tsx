import { describe, it, expect } from 'vitest';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { GuardRN } from '../packages/security/guards/react-native';
describe('GuardRN', ()=>{
  it('blocks unauthorized', ()=>{
    const tree = TestRenderer.create(<GuardRN role='guest' feature='payroll'>ok</GuardRN>).toJSON();
    // expect it to render a wrapper view with text in Persian "دسترسی غیرمجاز"
    expect(JSON.stringify(tree)).toContain('\u062F\u0633\u062A\u0631\u0633\u06CC');
  });
  it('allows authorized', ()=>{
    const tree = TestRenderer.create(<GuardRN role='coach' feature='payroll'>ok</GuardRN>).toJSON();
    expect(JSON.stringify(tree)).toContain('ok');
  });
});
