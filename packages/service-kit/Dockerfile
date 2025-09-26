
# syntax=docker/dockerfile:1
FROM node:20-slim AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml* .npmrc* ./
COPY ../../pnpm-workspace.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store             npx -y pnpm@9 install --no-frozen-lockfile

FROM node:20-slim AS builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx -y pnpm@9 run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY package.json .
EXPOSE 3000
CMD ["node","dist/main.js"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -qO- http://localhost:${PORT:-3000}/health || exit 1

USER node
