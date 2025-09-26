import { useState } from 'react';

export function useForm(initialValues: any) {
  const [values, setValues] = useState(initialValues);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setValues(initialValues);
  }

  return { values, handleChange, resetForm };
}