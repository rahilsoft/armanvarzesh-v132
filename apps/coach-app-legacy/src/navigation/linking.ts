import { LinkingOptions } from '@react-navigation/native';
import { ROUTES } from './routes';

export const linking: LinkingOptions<any> = {
  prefixes: ['arman://app', 'https://arman.app'],
  config: {
    screens: {
      [ROUTES.Home]: '',
      [ROUTES.Login]: 'login',
      [ROUTES.Checkout]: 'checkout',
      [ROUTES.Payments]: 'payments',
    },
  },
};
