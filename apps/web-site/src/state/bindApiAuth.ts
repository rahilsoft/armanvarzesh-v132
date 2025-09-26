import { authStore } from '@arman/state';
import { api } from '../lib/api';

// For web SSR/CSR, token binding strategy depends on auth approach (cookie vs localStorage).
// This binder shows how to access current token without side effects.
authStore.subscribe((s) => {
  // If you later attach token to axios for browser requests, do it here.
  // Example: api.defaults.headers['Authorization'] = s.token ? `Bearer ${s.token}` : '';
});
