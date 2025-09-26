export const ROUTES = {
  Home: 'Home',
  Login: 'Login',
  Checkout: 'Checkout',
  Payments: 'Payments',
} as const;

export type AppRouteName = keyof typeof ROUTES;
