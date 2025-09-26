import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import fetch from 'cross-fetch';

export function createApolloClient() {
  const uri = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/graphql';
  return new ApolloClient({
    link: new HttpLink({ uri, fetch }),
    cache: new InMemoryCache(),
  });
}
