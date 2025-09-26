ENV NODE_ENV=production
# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-lock.yaml .
RUN pnpm fetch

FROM deps AS build
COPY . .
RUN pnpm -r --offline install
WORKDIR /app/packages/contracts
RUN pnpm build

FROM node:20-alpine AS runtime
WORKDIR /srv
RUN addgroup -S nodejs && adduser -S node -G nodejs
COPY --from=build /app .
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=5 CMD node -e "process.exit(0)"
WORKDIR /srv/packages/contracts
CMD ["node","dist/main.js"]