import { ApolloDriverConfig } from '@nestjs/apollo';
import depthLimit from 'graphql-depth-limit';
import { specifiedRules } from 'graphql';

export const extraApolloConfig: Partial<ApolloDriverConfig> = {
  introspection: process.env.ENABLE_GRAPHQL_INTROSPECTION === 'true',
  playground: process.env.ENABLE_GRAPHQL_PLAYGROUND === 'true',
  validationRules: [
    depthLimit(Number(process.env.GRAPHQL_DEPTH_LIMIT || 8)),
    ...specifiedRules
  ],
};
