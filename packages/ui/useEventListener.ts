import { useEffect, useRef } from 'react';

/**
useEventListener
Subscribes to a DOM/EventTarget event and automatically cleans up on unmount.
@param target - EventTarget to listen on
@param type - Event type string
@param handler - Event handler
@param options - addEventListener options
*/
export function useEventListener<T extends EventTarget>(target: T | null | undefined, type: string, handler: (e: Event) => void, options?: AddEventListenerOptions) {
  const saved = useRef(handler);
  saved.current = handler;
  useEffect(() => {
    if (!target) return;
    const h = (e: Event) => saved.current(e);
    target.addEventListener(type, h, options);
    return () => target.removeEventListener(type, h, options);
  }, [target, type, options?.capture, options?.once, options?.passive]);
}

/**
useInterval
Schedules a repeating function call and clears it when `ms` becomes null or on unmount.
@param fn - Function to invoke
@param ms - Interval in milliseconds or null to disable
*/
export function useInterval(fn: () => void, ms: number | null) {
  useEffect(() => {
    if (ms == null) return;
    const id = setInterval(fn, ms);
    return () => clearInterval(id);
  }, [fn, ms]);
}
