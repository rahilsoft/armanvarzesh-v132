ENV NODE_ENV=production

FROM node:20-alpine
WORKDIR /app

# Install wget for healthcheck
RUN apk add --no-cache wget

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Expose port
EXPOSE 4010

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-4010}/health || exit 1

# Start application
CMD ["npm", "run", "dev"]

# Switch to non-root user
USER node
