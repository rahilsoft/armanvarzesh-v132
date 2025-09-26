
# Multi-stage: deps → build → runtime
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache wget && \
     npm i -g pnpm && pnpm install

FROM node:18-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build || true

FROM node:18-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app .
EXPOSE 3000
CMD ["pnpm","start"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -qO- http://localhost:${PORT:-3000}/health || exit 1

USER node
