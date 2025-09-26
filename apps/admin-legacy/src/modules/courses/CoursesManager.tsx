import React from 'react';
import { useCourses } from '../../../../packages/data/courses/hooks';
export default function CoursesManager(){
  const { data, loading, error } = useCourses();
  return (
    <div dir="rtl">
      <h2>مدیریت دوره‌ها</h2>
      {loading? <div>Loading…</div> : error? <div>Error</div> :
        <table><thead><tr><th>عنوان</th><th>مدرس</th><th>سطح</th></tr></thead>
          <tbody>{data?.map(c=> <tr key={c.id}><td>{c.title}</td><td>{c.coach}</td><td>{c.level}</td></tr>)}</tbody>
        </table>}
    </div>
  );
}
