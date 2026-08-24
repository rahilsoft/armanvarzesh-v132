import { RemoteGraphQLDataSource } from '@apollo/gateway';

/**
 * Forwards the caller's Authorization header on to each subgraph request, so
 * subgraphs can verify the JWT themselves. Extracted from main.ts (which
 * bootstraps a listening server on import) so it can be tested directly.
 */
export class JwtDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }: any) {
    if (context?.authHeader) request.http?.headers.set('authorization', context.authHeader);
  }
}
