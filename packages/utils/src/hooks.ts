import { useRef, useCallback } from 'react';

/** useStableCallback returns a stable function identity while always seeing the latest fn */
export function useStableCallback<T extends (...args: any[]) => any>(fn: T): T {
  const ref = useRef(fn);
  ref.current = fn;
  return useCallback(((...args: any[]) => ref.current(...args)) as T, []);
}
