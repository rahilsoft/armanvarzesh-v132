import React from 'react';
import { useProducts } from '../../../../packages/data/marketplace/hooks';
export default function Catalog(){
  const { data, loading } = useProducts();
  if(loading) return <div>Loading…</div>;
  return (
    <div dir="rtl">
      <h2>کاتالوگ فروشگاه</h2>
      <table><thead><tr><th>نام</th><th>قیمت</th><th>دسته</th><th>موجودی</th></tr></thead>
      <tbody>{(data||[]).map(p=> <tr key={p.id}><td>{p.title}</td><td>{p.price}</td><td>{p.category}</td><td>{p.stock}</td></tr>)}</tbody></table>
    </div>
  );
}
