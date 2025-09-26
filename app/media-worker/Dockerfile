FROM node:20-alpine
RUN apk add --no-cache ffmpeg
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm i -g pnpm@9 && pnpm i --frozen-lockfile=false
COPY src ./src
RUN pnpm build
ENV NODE_ENV=production
CMD ["node", "dist/worker.js"]


ENV S3_ENDPOINT=http://minio:9000 \
    S3_REGION=us-east-1 \
    S3_BUCKET=arman \
    S3_ACCESS_KEY=minioadmin \
    S3_SECRET_KEY=minioadmin \
    S3_FORCE_PATH_STYLE=true

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -qO- http://localhost:${PORT:-3000}/health || exit 1

USER node
