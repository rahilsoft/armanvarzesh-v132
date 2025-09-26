import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'solid'|'ghost' }> = ({ variant='solid', ...props }) => {
  const cls = variant === 'ghost' ? 'btn ghost' : 'btn';
  return <button {...props} className={cls + (props.className ? ' ' + props.className : '')} />;
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return <input {...props} className={'input' + (props.className ? ' ' + props.className : '')} />;
};

export const Card: React.FC<React.PropsWithChildren<{ title?: string }>> = ({ title, children }) => {
  return <div className="card"><>{title && <h3 style={{marginTop:0}}>{title}</h3>}{children}</></div>;
};

export type Column<T> = { key: keyof T; header: string };
export function Table<T extends Record<string, any>>({ data, columns }: { data: T[]; columns: Column<T>[] }) {
  return <table className="table">
    <thead><tr>{columns.map(c => <th key={String(c.key)}>{c.header}</th>)}</tr></thead>
    <tbody>{data.map((row, i) => <tr key={i}>{columns.map(c => <td key={String(c.key)}>{String(row[c.key] ?? '')}</td>)}</tr>)}</tbody>
  </table>;
}
