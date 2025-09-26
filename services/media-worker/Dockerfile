ENV NODE_ENV=production
FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache wget && \
     corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile || pnpm install --prod

COPY . .
RUN pnpm build

CMD ["node", "dist/main.js"]

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -qO- http://localhost:${PORT:-3000}/health || exit 1

USER node
