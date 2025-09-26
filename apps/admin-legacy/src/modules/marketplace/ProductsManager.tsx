import React from 'react';
import { useProducts } from '../../../../packages/data/marketplace/hooks';
export default function ProductsManager(){
  const { data, loading, error } = useProducts();
  if(loading) return <div>Loading…</div>;
  if(error) return <div>Error</div>;
  return (
    <div dir="rtl">
      <h2>مدیریت محصولات</h2>
      <table><thead><tr><th>عنوان</th><th>قیمت</th></tr></thead>
        <tbody>{data?.map(p=> <tr key={p.id}><td>{p.title}</td><td>{p.price}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
