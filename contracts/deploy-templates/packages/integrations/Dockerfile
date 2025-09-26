ENV NODE_ENV=production
# AUTO (Stage43 TEMPLATE): Dockerfile for @arman/integrations
# Base chosen from manifest target: UNKNOWN (fallback to node:20-alpine)
FROM node:20-alpine
WORKDIR /app
# NOTE: This is a template; we avoid copying entire monorepo to prevent context bloat.
# Adjust paths according to your CI build context.
COPY package.json pnpm-lock.yaml* ./
RUN apk add --no-cache wget && \
     corepack enable && pnpm install --prod --no-frozen-lockfile || true
COPY . .
# Build step (TS/Nest): ensure build script exists
RUN pnpm build || true
EXPOSE 3000
CMD ["node", "dist/main.js"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -qO- http://localhost:${PORT:-3000}/health || exit 1

USER node
