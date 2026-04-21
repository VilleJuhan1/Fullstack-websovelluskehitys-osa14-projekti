# Stage 1: Build the application
FROM node:20 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run the application in a minimal alpine container
FROM node:20-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
# Install only production dependencies
RUN npm install --omit=dev
COPY --from=builder /usr/src/app/dist ./dist

# Run as a non-root user for better security
USER node
EXPOSE 4000
CMD ["npm", "start"]