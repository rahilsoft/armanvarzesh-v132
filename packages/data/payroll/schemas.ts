export type PayrollItem = { id:string; period:string; amount:number; currency:'IRT'|'EUR'|'USD'; status:'pending'|'paid'|'failed' };
export type PayrollSummary = { total:number; currency:'IRT'|'EUR'|'USD'; items:PayrollItem[] };
