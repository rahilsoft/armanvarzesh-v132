
FROM node:20.19.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i -g pnpm@10 && pnpm install --prod=false
COPY . .
RUN pnpm run build || true
EXPOSE 3000
CMD ["pnpm","start"]
