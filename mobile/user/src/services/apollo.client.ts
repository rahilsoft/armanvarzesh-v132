import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import ENV from '@config/env';
import storageService from './storage.service';
import authService from './auth.service';

// HTTP Link
const httpLink = createHttpLink({
  uri: ENV.GRAPHQL_URL,
});

// Auth Link - add token to headers
const authLink = setContext(async (_, { headers }) => {
  const token = await storageService.getAccessToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Error Link - handle errors globally
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      console.error(`[GraphQL error]: ${err.message}`, err);

      // Handle specific error codes
      switch (err.extensions?.code) {
        case 'UNAUTHENTICATED':
          // Token expired or invalid, try to refresh
          return authService.refreshToken(storageService.getRefreshToken() as any).then(
            async (tokens) => {
              await storageService.setAccessToken(tokens.accessToken);
              await storageService.setRefreshToken(tokens.refreshToken);

              // Retry the failed operation
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: `Bearer ${tokens.accessToken}`,
                },
              });

              return forward(operation);
            }
          ).catch(() => {
            // Refresh failed, logout
            authService.logout();
          });

        case 'FORBIDDEN':
          console.error('Access forbidden');
          break;

        case 'BAD_USER_INPUT':
          console.error('Invalid input:', err.message);
          break;
      }
    }
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError.message}`);
  }
});

// Retry Link - retry failed requests
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 3000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => {
      // Retry on network errors but not on 4xx errors
      return !!error && !error.statusCode?.toString().startsWith('4');
    },
  },
});

// Cache configuration
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Pagination for workouts
        workouts: {
          keyArgs: ['filter'],
          merge(existing = { items: [] }, incoming) {
            return {
              ...incoming,
              items: [...existing.items, ...incoming.items],
            };
          },
        },
        // Pagination for nutrition logs
        nutritionLogs: {
          keyArgs: ['filter'],
          merge(existing = { items: [] }, incoming) {
            return {
              ...incoming,
              items: [...existing.items, ...incoming.items],
            };
          },
        },
        // Pagination for messages
        messages: {
          keyArgs: ['threadId'],
          merge(existing = { items: [] }, incoming) {
            return {
              ...incoming,
              items: [...existing.items, ...incoming.items],
            };
          },
        },
      },
    },
    User: {
      keyFields: ['id'],
    },
    Workout: {
      keyFields: ['id'],
    },
    Exercise: {
      keyFields: ['id'],
    },
    NutritionPlan: {
      keyFields: ['id'],
    },
    Message: {
      keyFields: ['id'],
    },
  },
});

// Create Apollo Client
const apolloClient = new ApolloClient({
  link: from([retryLink, errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default apolloClient;
