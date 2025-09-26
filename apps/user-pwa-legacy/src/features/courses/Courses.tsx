import React from 'react';
import { useCourses } from '../../../packages/data/courses/hooks';
export default function Courses(){
  const { data, loading } = useCourses();
  return (
    <div dir="rtl" style={{padding:12}}>
      <h3>دوره‌ها (PWA)</h3>
      {loading? '...' : (data||[]).map(c=> <div key={c.id}>{c.title} — {c.level}</div>)}
    </div>
  );
}
