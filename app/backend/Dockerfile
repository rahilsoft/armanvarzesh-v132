# syntax=docker/dockerfile:1
#
# Build context is the repository root (this is a pnpm monorepo). The backend
# compiles workspace `packages/*` and `contracts/*` sources into its own dist,
# so the whole workspace must be present at build time.

FROM node:20.19.0-alpine AS build
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate
# Full monorepo context (packages/ and contracts/ are compiled in).
COPY . .
RUN pnpm install --frozen-lockfile
# Generate the Prisma client the build type-checks and runs against.
RUN pnpm --filter @arman/backend run prisma:generate
# No `|| true`: a failed build must fail the image.
RUN pnpm --filter @arman/backend run build

FROM node:20.19.0-alpine AS runtime
WORKDIR /repo
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
# Compiled output, the module graph it resolves against, and the manifest.
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/app/backend/dist ./app/backend/dist
COPY --from=build /repo/app/backend/package.json ./app/backend/package.json
COPY --from=build /repo/app/backend/src/database/prisma/generated ./app/backend/src/database/prisma/generated
USER app
ENV PORT=4000
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD wget -qO- http://localhost:$PORT/health || exit 1
# Emit layout mirrors the workspace root (rootDir covers the monorepo), so the
# entrypoint lives under dist/app/backend/src/.
CMD ["node", "app/backend/dist/app/backend/src/main.js"]
