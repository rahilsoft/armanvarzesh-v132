import { ApolloClient, InMemoryCache, createHttpLink, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const HTTP_URL = process.env.EXPO_PUBLIC_GRAPHQL_HTTP || "http://localhost:4000/graphql";
const WS_URL = process.env.EXPO_PUBLIC_GRAPHQL_WS || "ws://localhost:4000/graphql";

const httpLink = createHttpLink({ uri: HTTP_URL });

const authLink = setContext((_, { headers }) => {
  const token = process.env.TOKEN || "changeme"",
    }
  }
});

const wsLink = new GraphQLWsLink(createClient({
  url: WS_URL,
  connectionParams: async () => {
    const token = process.env.TOKEN || "changeme"" } };
  }
}));

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === 'OperationDefinition' && def.operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

export default client;
