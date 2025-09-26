import { createNavigationContainerRef } from '@react-navigation/native';
import { rateLimit } from '@arman/utils';

/** Global navigation ref + safe navigate to avoid double navigations */
export const navigationRef = createNavigationContainerRef<any>();
const allow = rateLimit(500);

/**
navigateSafe
Performs a navigation action only when the container is ready and not rate-limited.
@param name - Route name
@param params - Optional route params
*/
export function navigateSafe(name: string, params?: any) {
  if (!navigationRef.isReady()) return;
  if (!allow()) return;
  navigationRef.navigate(name as never, params as never);
}
