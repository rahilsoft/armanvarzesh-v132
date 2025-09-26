/**
API_ROUTES
Central registry of REST paths used by controllers and clients.
@remarks
Keep this map as the single source of truth to avoid hardcoded strings across layers.
*/
export const API_ROUTES = {
  auth: {
    base: 'auth',
    login: 'auth/login',
    refresh: 'auth/refresh',
    logout: 'auth/logout',
  },
  payments: {
    base: 'payments',
    create: 'payments',        // POST
    list: 'payments',          // GET
  },
} as const;
