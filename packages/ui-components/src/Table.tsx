import React from 'react';

export type Column<T> = { key: keyof T; header: string };

export function Table<T extends Record<string, any>>({ data, columns }: { data: T[]; columns: Column<T>[] }) {
  return (
    <table className="table av-table">
      <thead>
        <tr>{columns.map((c) => <th key={String(c.key)} scope="col">{c.header}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>{columns.map((c) => <td key={String(c.key)}>{String(row[c.key] ?? '')}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}
