# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY services/marketplace-service/package.json services/marketplace-service/
RUN pnpm -w install --frozen-lockfile

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app /app
COPY services/marketplace-service services/marketplace-service
RUN pnpm -w -C services/marketplace-service build || pnpm -w -C services/marketplace-service run build || true

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
COPY --from=deps /app/pnpm-lock.yaml /app/package.json ./
COPY --from=deps /app/services/marketplace-service/package.json services/marketplace-service/
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate \
  && pnpm -w install --frozen-lockfile --prod --filter ./services/marketplace-service \
  && pnpm -w prune --prod --filter ./services/marketplace-service || true
COPY --from=build /app/services/marketplace-service/dist services/marketplace-service/dist
USER app
ENV PORT=${PORT:-4000}
EXPOSE $PORT
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD wget -qO- http://localhost:$PORT/health || exit 1
CMD ["node", "services/marketplace-service/dist/main.js"]
