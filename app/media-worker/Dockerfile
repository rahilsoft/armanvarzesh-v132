FROM node:20.19.0-alpine
RUN apk add --no-cache ffmpeg
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm i -g pnpm@10 && pnpm i --frozen-lockfile=false
COPY src ./src
RUN pnpm build
ENV NODE_ENV=production
CMD ["node", "dist/worker.js"]

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -qO- http://localhost:${PORT:-3000}/health || exit 1

USER node
