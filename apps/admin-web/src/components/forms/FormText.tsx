import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Input } from 'antd';

export const FormText = ({ name, control, label, placeholder }: { name: string, control: Control<any>, label?: string, placeholder?: string }) => (
  <div style={{ marginBottom: 'var(--space-md)' }}>
    {label && <label style={{ display: 'block', marginBottom: 6 }}>{label}</label>}
    <Controller name={name} control={control} render={({ field }) => <Input {...field} placeholder={placeholder} />} />
  </div>
);
