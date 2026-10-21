// Subgraph configuration for the federation gateway.
//
// The production backend is the NestJS monolith (app/backend). Its GraphQL
// endpoint is the default subgraph and is configured only through BACKEND_URL.
// The legacy services/* subgraphs (users, coaches, nutrition, content, ...)
// were removed and are no longer routed.

export interface SubgraphConfig {
  name: string;
  url: string;
}

export const DEV_BACKEND_URL = 'http://localhost:4000/graphql';

const NON_PRODUCTION_ENVS = ['development', 'test'];

/**
 * Resolve the monolith GraphQL endpoint.
 * - BACKEND_URL set: used as-is (must be an absolute http(s) URL).
 * - BACKEND_URL unset and NODE_ENV exactly 'development' or 'test': local default.
 * - BACKEND_URL unset otherwise: throws, so production never silently falls back to a host.
 */
export function resolveBackendUrl(env: NodeJS.ProcessEnv): string {
  const raw = env.BACKEND_URL?.trim();
  if (!raw) {
    if (env.NODE_ENV && NON_PRODUCTION_ENVS.includes(env.NODE_ENV)) {
      return DEV_BACKEND_URL;
    }
    throw new Error(
      'BACKEND_URL is required when NODE_ENV is not "development" or "test" ' +
        '(monolith GraphQL endpoint, e.g. http://armanfit-backend:80/graphql)',
    );
  }
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`BACKEND_URL is not a valid URL: ${raw}`);
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`BACKEND_URL must use http or https, got: ${parsed.protocol}`);
  }
  return raw;
}

/**
 * Resolve the subgraph list.
 * - SUBGRAPHS_JSON, when set, is an explicit override and is used verbatim.
 * - Otherwise: the monolith (from BACKEND_URL) plus the self-contained app/*
 *   subgraphs (activity, social, live). app/physio-subgraph is not routed: it
 *   only proxies the removed physio-service REST API.
 */
export function resolveSubgraphs(env: NodeJS.ProcessEnv): SubgraphConfig[] {
  if (env.SUBGRAPHS_JSON) {
    return JSON.parse(env.SUBGRAPHS_JSON) as SubgraphConfig[];
  }
  return [
    { name: 'backend', url: resolveBackendUrl(env) },
    { name: 'activity', url: env.ACTIVITY_URL || 'http://activity-subgraph:4005/graphql' },
    { name: 'social', url: env.SOCIAL_URL || 'http://social-subgraph:4006/graphql' },
    { name: 'live', url: env.LIVE_URL || 'http://live-subgraph:4017/graphql' },
  ];
}
