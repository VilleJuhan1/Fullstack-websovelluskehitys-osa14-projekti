# Build stage using the new node 26 LTS
FROM node:26-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# After build, run in an alpine container for minimal overhead
FROM node:26-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
# Install only production dependencies
RUN npm ci --omit=dev
COPY --from=builder --chown=node:node /usr/src/app/dist ./dist

# Run as a non-root user for better security 
USER node
EXPOSE 4000

# Run production build
CMD ["node", "dist/index.js"]