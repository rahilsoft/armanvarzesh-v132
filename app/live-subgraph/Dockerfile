FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache wget && \
     npm i -g pnpm@8 && pnpm install --frozen-lockfile || true
COPY . .
RUN npx tsc -p tsconfig.json || pnpm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm i -g pnpm@8 && pnpm i --prod --frozen-lockfile || true
EXPOSE 4004
CMD ["node","dist/main.js"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -qO- http://localhost:${PORT:-3000}/health || exit 1

USER node
