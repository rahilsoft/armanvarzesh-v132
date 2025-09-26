
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export function getApolloClient(){
  const uri = process.env.NEXT_PUBLIC_GRAPHQL_URL || '';
  const link = new HttpLink({ uri, fetch });
  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: { fetchPolicy: 'cache-first' },
      watchQuery: { fetchPolicy: 'cache-and-network' },
    }
  });
}
