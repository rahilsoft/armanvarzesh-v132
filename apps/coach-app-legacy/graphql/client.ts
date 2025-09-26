
import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import Constants from 'expo-constants';
import { getToken, setToken } from "./tokenStore";

const uri = (Constants?.expoConfig?.extra?.GRAPHQL_HTTP) || process.env.EXPO_PUBLIC_GRAPHQL_HTTP || "https://api.armanfit.com/graphql";
const httpLink = createHttpLink({ uri });

const authLink = setContext(async (_, { headers }) => {
  const token = getToken();
  return { headers: { ...headers, authorization: token ? `Bearer ${token}` : "" } };
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  // Optional: if server returns 401 and refresh is enabled, attempt silent refresh (pseudo)
  const refreshEnabled = (process.env.EXPO_PUBLIC_REFRESH_ENABLED || 'false') === 'true';
  // You can add refresh flow here when backend supports it.
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache()
});

export default client;
