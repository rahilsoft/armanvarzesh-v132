export type KPI = { id:string; label:string; value:number; unit?:string; trend?:'up'|'down'|'flat' };
export type SeriesPoint = { t:string; v:number };
export type Series = { id:string; label:string; points:SeriesPoint[] };
