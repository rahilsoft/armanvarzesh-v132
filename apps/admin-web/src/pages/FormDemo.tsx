import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Alert } from 'antd';
import { FormText } from '../components/forms/FormText';

const schema = z.object({
  email: z.string().email('ایمیل معتبر نیست'),
  name: z.string().min(2, 'نام خیلی کوتاه است'),
});

export default function FormDemo() {
  const { control, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  return (
    <div className="container card">
      <h2>فرم نمونه</h2>
      <form onSubmit={handleSubmit((v)=>console.log(v))}>
        <FormText name="email" control={control} label="ایمیل" placeholder="email@example.com" />
        {errors.email && <Alert type="error" message={errors.email.message as string} />}
        <FormText name="name" control={control} label="نام" placeholder="نام شما" />
        {errors.name && <Alert type="error" message={errors.name.message as string} />}
        <Button htmlType="submit" type="primary" style={{ marginTop: 12 }}>ارسال</Button>
      </form>
    </div>
  );
}
