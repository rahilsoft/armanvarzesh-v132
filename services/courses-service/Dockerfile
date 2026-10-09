# syntax=docker/dockerfile:1
# Built from the REPO ROOT (docker-bake.hcl / preview-real set context=".").
# The service depends on workspace packages, so a standalone npm install in
# this directory can never resolve "workspace:*" — the whole pnpm workspace
# is the build context instead.
FROM node:20.19.0-alpine
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate
WORKDIR /repo
COPY . .
RUN pnpm install --frozen-lockfile --filter "courses-service..."
RUN if [ -f services/courses-service/prisma/schema.prisma ]; then cd services/courses-service && npx prisma generate --schema prisma/schema.prisma; fi
RUN pnpm --filter "courses-service" run build
RUN pnpm prune --prod || true
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000
USER node
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD wget -qO- http://localhost:$PORT/health || exit 1
CMD ["node","services/courses-service/dist/services/courses-service/src/main.js"]
