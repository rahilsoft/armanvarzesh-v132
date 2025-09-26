
'use client';
import { onCLS, onFID, onLCP, onINP, onTTFB } from 'web-vitals';
import { logEvent } from './analytics';

export function initWebVitals(){
  if (typeof window === 'undefined') return;
  onLCP((m)=> logEvent('webvitals_LCP', { value: m.value }));
  onCLS((m)=> logEvent('webvitals_CLS', { value: m.value }));
  onFID((m)=> logEvent('webvitals_FID', { value: m.value }));
  onINP((m)=> logEvent('webvitals_INP', { value: m.value }));
  onTTFB((m)=> logEvent('webvitals_TTFB', { value: m.value }));
}
