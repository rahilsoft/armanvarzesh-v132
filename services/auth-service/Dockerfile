ENV NODE_ENV=production

FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN apk add --no-cache wget && \
     npm i
COPY src ./src
EXPOSE 4000
CMD ["npm","run","dev"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -qO- http://localhost:${PORT:-3000}/health || exit 1

USER node
