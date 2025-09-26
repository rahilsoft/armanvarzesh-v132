# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY services/nutrition-service/package.json services/nutrition-service/
RUN pnpm -w install --frozen-lockfile

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app /app
COPY services/nutrition-service services/nutrition-service
RUN pnpm -w -C services/nutrition-service build || pnpm -w -C services/nutrition-service run build || true

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
COPY --from=deps /app/pnpm-lock.yaml /app/package.json ./
COPY --from=deps /app/services/nutrition-service/package.json services/nutrition-service/
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate \
  && pnpm -w install --frozen-lockfile --prod --filter ./services/nutrition-service \
  && pnpm -w prune --prod --filter ./services/nutrition-service || true
COPY --from=build /app/services/nutrition-service/dist services/nutrition-service/dist
USER app
ENV PORT=${PORT:-4000}
EXPOSE $PORT
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD wget -qO- http://localhost:$PORT/health || exit 1
CMD ["node", "services/nutrition-service/dist/main.js"]
