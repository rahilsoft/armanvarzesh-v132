import { PubSub } from 'graphql-subscriptions';

/**
 * Standalone injection token + provider for the GraphQL PubSub the ChatResolver
 * subscribes through. Kept in its own module with no back-imports so the token
 * is always defined at decoration time (the notifications module defines an
 * equivalent 'PUB_SUB' token but through a circular import that leaves it
 * undefined when its resolver is instantiated).
 */
export const PUB_SUB = 'PUB_SUB';

export const PubSubProvider = { provide: PUB_SUB, useValue: new PubSub() };
