ENV NODE_ENV=production
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate && pnpm install --frozen-lockfile || pnpm install
COPY . .
# For Expo: you typically use EAS for production builds; this Dockerfile runs dev server.
EXPOSE 8081
CMD ["pnpm","run","start"]

HEALTHCHECK --interval=30s --timeout=3s CMD node -e "require('http').get('http://localhost:3000/health/live', res=>process.exit(res.statusCode>=200&&res.statusCode<500?0:1)).on('error',()=>process.exit(1))"

USER node
