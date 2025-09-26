
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i -g pnpm@9 && pnpm install --prod=false
COPY . .
RUN pnpm run build || true
EXPOSE 3000
CMD ["pnpm","start"]
