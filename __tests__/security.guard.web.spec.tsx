import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { Guard } from '../packages/security/guards/react';
describe('Guard (web)', ()=>{
  it('renders fallback when not allowed', ()=>{
    const { getByText } = render(<Guard role='guest' feature='payroll' action='view' fallback={<span>nope</span>}>ok</Guard>);
    expect(getByText('nope')).toBeTruthy();
  });
  it('renders children when allowed', ()=>{
    const { getByText } = render(<Guard role='coach' feature='payroll' action='view'>ok</Guard>);
    expect(getByText('ok')).toBeTruthy();
  });
});
