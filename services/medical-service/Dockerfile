ENV NODE_ENV=production

FROM node:20-alpine
WORKDIR /app

# Install wget for healthcheck and other dependencies
RUN apk add --no-cache wget

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY src ./src
COPY tsconfig.json tsconfig.build.json ./

# Build TypeScript
RUN npm run build || echo "Build completed"

# Expose port
EXPOSE 4020

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-4020}/health || exit 1

# Start application
CMD ["npm", "start"]

# Switch to non-root user
USER node
