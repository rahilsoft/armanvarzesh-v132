export function toCSV(rows: any[]): string {
  if (!rows.length) return '';
  const keys = Object.keys(rows[0]);
  const head = keys.join(',');
  const body = rows.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(',')).join('\n');
  return head + '\n' + body;
}
export function downloadCSV(filename:string, rows:any[]){
  const csv = toCSV(rows);
  const blob = new Blob([csv], {type:'text/csv'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}
