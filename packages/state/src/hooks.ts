import shallow from 'zustand/shallow';
import { authStore } from './auth.store';

/**
useAuthSelector
Zustand selector hook bound to the auth store with shallow comparison to reduce re-renders.
@param selector - Function mapping store state to derived value
*/
export function useAuthSelector<T>(selector: (s: ReturnType<typeof authStore.getState>) => T): T {
  // @ts-ignore - zustand shallow works with getState() store hook signature as well
  return (authStore as any)((s: any) => selector(s), shallow);
}
