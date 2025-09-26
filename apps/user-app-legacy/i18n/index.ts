type Dict = Record<string, string>;
const dict: Dict = {};
export function t(key: string, fallback?: string) { return dict[key] ?? fallback ?? key; }
export default t;
