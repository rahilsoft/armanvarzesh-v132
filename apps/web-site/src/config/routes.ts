export const routes = {
  home: () => '/',
  login: () => '/login',
  payments: {
    checkout: () => '/payments/checkout',
    list: (q?: { cursor?: string; limit?: number }) => {
      const params = new URLSearchParams();
      if (q?.cursor) params.set('cursor', q.cursor);
      if (q?.limit) params.set('limit', String(q.limit));
      const query = params.toString();
      return query ? `/payments?${query}` : '/payments';
    },
  },
} as const;
