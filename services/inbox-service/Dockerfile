
FROM node:20.19.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i -g pnpm@10 && pnpm install --prod=false
COPY . .
RUN pnpm run build || true
RUN apk add --no-cache curl
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD curl -fsS http://localhost:3000/readyz || exit 1
CMD ["pnpm","start"]
