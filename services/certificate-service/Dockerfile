# syntax=docker/dockerfile:1.6
FROM node:20-alpine AS deps
WORKDIR /srv
COPY package*.json* ./
RUN apk add --no-cache wget && \
     npm i -g pnpm && pnpm i

FROM node:20-alpine AS build
WORKDIR /srv
COPY . .
RUN npm i -g pnpm && pnpm i && pnpm run build

FROM node:20-alpine
WORKDIR /srv
ENV NODE_ENV=production
COPY --from=build /srv/dist ./dist
COPY --from=build /srv/package.json ./package.json
EXPOSE 3017
CMD ["node","dist/main.js"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -qO- http://localhost:${PORT:-3000}/health || exit 1

USER node
