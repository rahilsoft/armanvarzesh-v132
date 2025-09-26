import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const Button = ({ children }: { children: React.ReactNode }) => (
  <button style={{ padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-sm)', background: 'var(--color-primary)', color: '#fff', border: 0 }}>
    {children}
  </button>
);

const meta: Meta<typeof Button> = { title: 'Atoms/Button', component: Button };
export default meta;
export const Primary: StoryObj<typeof Button> = { args: { children: 'دکمه' } };
