# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
RUN corepack enable && apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# turbo.json optional
COPY turbo.json* ./ 2>/dev/null || true
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm -r --filter ./app/social-subgraph... build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy built app and dependencies
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/social-subgraph/package.json ./package.json
COPY --from=base /app/apps/social-subgraph/dist ./dist
EXPOSE 3000
CMD ["node","dist/main.js"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -qO- http://localhost:${PORT:-3000}/health || exit 1

USER node
