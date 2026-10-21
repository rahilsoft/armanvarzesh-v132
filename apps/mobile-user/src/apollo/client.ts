import { ApolloClient, InMemoryCache, Observable, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getApiBaseUrl } from '../config/env';
import { useAuthStore } from '../store/authStore';

// Same origin as REST auth (env.ts), no hard-coded fallback.
const httpLink = createHttpLink({ uri: () => `${getApiBaseUrl()}/graphql` });

const authLink = setContext((_, { headers }) => {
  const token = useAuthStore.getState().token;
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

function isUnauthenticated(err: {
  graphQLErrors?: ReadonlyArray<{ extensions?: Record<string, unknown> }>;
  networkError?: unknown;
}): boolean {
  if (err.graphQLErrors?.some((e) => e.extensions?.code === 'UNAUTHENTICATED')) return true;
  const status = (err.networkError as { statusCode?: number } | undefined)?.statusCode;
  return status === 401;
}

/** On an expired access token: rotate once via /auth/refresh, then retry the operation. */
const refreshLink = onError((err) => {
  const { operation, forward } = err;
  if (!isUnauthenticated(err) || operation.getContext().authRetried) return;
  if (!useAuthStore.getState().refreshToken) return;
  return new Observable((observer) => {
    let sub: { unsubscribe: () => void } | undefined;
    useAuthStore
      .getState()
      .refreshSession()
      .then((ok) => {
        if (!ok) {
          observer.error(new Error('نشست شما منقضی شده است، دوباره وارد شوید'));
          return;
        }
        const token = useAuthStore.getState().token;
        operation.setContext(({ headers = {} }: { headers?: Record<string, string> }) => ({
          authRetried: true,
          headers: { ...headers, authorization: `Bearer ${token}` },
        }));
        sub = forward(operation).subscribe(observer);
      })
      .catch((e) => observer.error(e));
    return () => sub?.unsubscribe();
  });
});

export const apolloClient = new ApolloClient({
  link: from([refreshLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
