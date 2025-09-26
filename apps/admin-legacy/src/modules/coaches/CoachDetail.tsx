import React from 'react';
import { useCoach } from '../../../../packages/data/coaches/hooks';
export default function CoachDetail({ id='c1' }:{ id?:string }){
  const { data, loading } = useCoach(id);
  if(loading) return <div>Loading…</div>;
  return (
    <div dir="rtl">
      <h2>Coach Detail</h2>
      <pre>{JSON.stringify(data,null,2)}</pre>
    </div>
  );
}
