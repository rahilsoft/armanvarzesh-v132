import { authStore } from '@arman/state';
import { setAuthToken } from '../services/api';

// Initial sync
setAuthToken(authStore.getState().token);

// Subscribe for changes
authStore.subscribe((s) => {
  setAuthToken(s.token);
});
