# Stage 1: Build the React application
FROM node:24-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Pass build arguments so Vite can inject them into the static bundle
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_APP_VERSION
ENV VITE_APP_VERSION=$VITE_APP_VERSION

ARG VITE_SHOW_DEV_BAR
ENV VITE_SHOW_DEV_BAR=$VITE_SHOW_DEV_BAR

# Build the project (compiles TypeScript and creates the production bundle)
RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to Nginx's HTML folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
